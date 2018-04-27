var md5 = require("../../../utils/MD5.js");
var checkNetWork = require("../../../utils/checkNetWork.js");
var disabledToken = require("../../../utils/disabledToken.js");
var config = require('../../../config');
var app = getApp();
var modalFlag,//借完伞计时提示框
    modalFlag1 = true, //开始计费提示框
    modalFlag2 = true,//还伞确定支付提示框
    modalFlag3 = true,//借伞数量提示框
    modalFlag4 = true, //押金不足提示框
    toUsageLogHidden;

//获取应用实例
Page({
    canvasIdErrorCallback: function (e) {
        console.error(e.detail.errMsg)
    },
    data: {
        total_time: 0, //总的耗时
        total_fee: 0, //总的花费
        "modalFlag": true,
        "modalFlag1": true,
        "modalFlag2": true,
        "modalFlag3": true,
        "modalFlag4": true,
        "toUsageLogHidden": false,
        "is_show": true, //
        current_use: 0,//当前正在使用的伞的id
        rgnum: 0,
        hours: 0,
        minuters: 0,
        seconds: 0,
        billing: "正在计时",
        time: 3,
        confirmTime: 60,//还伞确认的倒计时
        contimes: '',//确认倒计时
        useNumber: 0,
        hidden: true,
        //时间倒计时
        clock: '',
        //地图的宽高
        mapHeight: '100%',
        mapWidth: '100%',
        mapTop: '0',

        //正在骑行中的视图的属性
        bikeRiding: {
            show: false,
            ridingTime: 0,
            ridingDistance: 0,
            ridingSpeed: 0,
            height: '25%',
            width: '100%',
            topLineHeight: "0rpx",
            bottomLineHeight: "0rpx",
        },
        //计费异常的视图的属性
        bikeAbnormity: {
            show: false,
            height: '15%',
            width: '100%',
        },

        //校验码
        SALT: "AIRBIKESALT",

        //是否能查询附近单车: 主要根据骑行中状态判断
        isCanGetBikeList: true,
        //查询附近单车请求参数
        getBikeListParams: {
            token: "airbike-token",
            longitude: "",
            latitude: "",
            checksum: ""
        },
        //请求单车开锁参数
        unlockBikeParams: {
            token: '',
            device_id: '',
            checksum: '',
        },

        //请求伞点的关锁参数
        stationParams: {
            use_record_id: '',
            station_end: '',
            admin_id: '',
            flag: '',
            station_start: '',

        },

        //重启APP后查询接口完成的标识
        completeStatu: true,
        //骑行中接口参数
        ridingBikeParams: {
            token: '',
            device_id: '',
            serial_no: '',
            checksum: '',
        },
        //用户当前位置
        point: {
            latitude: 0,
            longitude: 0
        },
        //伞点标注物
        markers: {},

        //当前地图的缩放级别
        mapScale: 16,
        //地图上不可移动的控件
        controls: [],
        //当前扫描的车辆ID
        currentBikeId: '',
        //已登录的地图组件
        hasLoginMapControls: [{ // //扫描二维码控件按钮
            id: 12,
            position: {
                left: 132.5 * wx.getStorageSync("kScreenW"),
                top: 500 * wx.getStorageSync("kScreenH"),
                width: 110 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
            },
            iconPath: '../../../images/imgs_custom_scan@2x.png',
            clickable: true,
        },
            //隐藏说明按钮
            {
                position: {
                    width: 1,
                    height: 1
                },
                iconPath: '../../../images/hidden_explain.png',
                clickable: true,
            },
            /*显示切换列表按钮*/
            {
                id: 28,
                position: {
                    left: 320 * wx.getStorageSync("kScreenW"),
                    top: 457 * wx.getStorageSync("kScreenH"),
                    width: 40 * wx.getStorageSync("kScreenW"),
                    height: 40 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/ico_show_list.png',
                clickable: true,
            }, {
                id: 11,
                position: {
                    left: 10 * wx.getStorageSync("kScreenW"),
                    top: 500 * wx.getStorageSync("kScreenH"),
                    width: 40 * wx.getStorageSync("kScreenW"),
                    height: 40 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/imgs_main_location@2x.png',
                clickable: true,
            },
            //用户----我的 按钮
            {
                id: 18,
                position: {
                    left: 320 * wx.getStorageSync("kScreenW"),
                    top: 500 * wx.getStorageSync("kScreenH"),
                    width: 40 * wx.getStorageSync("kScreenW"),
                    height: 40 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/user.png',
                clickable: true,
            },

            //地图中心位置按钮
            {
                id: 14,
                position: {
                    left: 165 * wx.getStorageSync("kScreenW"),
                    top: 260 * wx.getStorageSync("kScreenH"),
                    width: 40.8 * wx.getStorageSync("kScreenW"),
                    height: 44.7 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/imgs_main_umbrella.png',
                clickable: false,
            }
        ],
        //没有登录的地图组件
        notLoginMapControls: [{
            id: 16,
            position: {
                left: 132.5 * wx.getStorageSync("kScreenW"),
                top: 500 * wx.getStorageSync("kScreenH"),
                width: 110 * wx.getStorageSync("kScreenW"),
                height: 40 * wx.getStorageSync("kScreenW")
            },
            iconPath: '../../../images/login_register.png',
            clickable: true,
        },
            /*使用说明*/
            {
                id: 15,
                position: {
                    left: 45 * wx.getStorageSync("kScreenW"),
                    top: 20 * wx.getStorageSync("kScreenH"),
                    width: 285 * wx.getStorageSync("kScreenW"),
                    height: 40 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/explain.png',
                clickable: true,
            },
            /*显示切换列表按钮*/
            {
                id: 28,
                position: {
                    left: 320 * wx.getStorageSync("kScreenW"),
                    top: 457 * wx.getStorageSync("kScreenH"),
                    width: 40 * wx.getStorageSync("kScreenW"),
                    height: 40 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/ico_show_list.png',
                clickable: true,
            }, {
                id: 11,
                position: {
                    left: 10 * wx.getStorageSync("kScreenW"),
                    top: 500 * wx.getStorageSync("kScreenH"),
                    width: 40 * wx.getStorageSync("kScreenW"),
                    height: 40 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/imgs_main_location@2x.png',
                clickable: true,
            },
            //用户----我的 按钮
            {
                id: 18,
                position: {
                    left: 320 * wx.getStorageSync("kScreenW"),
                    top: 500 * wx.getStorageSync("kScreenH"),
                    width: 40 * wx.getStorageSync("kScreenW"),
                    height: 40 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/user.png',
                clickable: true,
            },
            //地图中心位置按钮
            {
                id: 14,
                position: {
                    left: 165 * wx.getStorageSync("kScreenW"),
                    top: 260 * wx.getStorageSync("kScreenH"),
                    width: 40.8 * wx.getStorageSync("kScreenW"),
                    height: 44.7 * wx.getStorageSync("kScreenW")
                },
                iconPath: '../../../images/imgs_main_umbrella.png',
                clickable: false,
            }
        ],
        //检测骑行中的定时器是否已创建
        isCreateTimerStatu: false
    },

    onReady: function (e) {
        // 使用 wx.createContext 获取绘图上下文 context
        var context = wx.createCanvasContext('firstCanvas')
        this.mapCtx = wx.createMapContext("myMap");

        context.setStrokeStyle("#00ff00")
        context.setLineWidth(5)
        context.rect(0, 0, 200, 200)
        context.stroke()
        context.setStrokeStyle("#ff0000")
        context.setLineWidth(2)
        context.moveTo(160, 100)
        context.arc(100, 100, 60, 0, 2 * Math.PI, true)
        context.moveTo(140, 100)
        context.arc(100, 100, 40, 0, Math.PI, false)
        context.moveTo(85, 80)
        context.arc(80, 80, 5, 0, 2 * Math.PI, true)
        context.moveTo(125, 80)
        context.arc(120, 80, 5, 0, 2 * Math.PI, true)
        context.stroke()
        context.draw()
    },
    //控件的点击事件
    controltap: function (e) {
        console.log(e)
        var that = this
        var login_state = wx.getStorageSync('login_state')
        var id = e.controlId
        console.log(id);
        if (id == 11) {
            //定位当前位置
            that.getUserCurrentLocation()
        } else if (id == 12) {
            //扫描二维码 扫描二维码 扫描二维码
            wx.scanCode({
                success: function (res) {
                    //--------yh_start---------
                    //获取当前时间戳
                    var checksum = that.data.unlockBikeParams.token + res.result + that.data.SALT
                    var checksumMd5 = md5.hexMD5(checksum)
                    that.setData({
                        'stationParams.station_start': res.result, //站点id
                    })
                    //扫码之后请求接口
                    that.scanBikeQr()
                },
                //----------yh_end---------
                fail: function () {
                    wx.showToast({
                        title: '扫码失败',
                        icon: 'loading',
                        duration: 2000,
                    })
                },
            })
        } else if (id == 18) {
            console.log("我刚刚点击我的")

            if (login_state == 3) { //代表已登录
                wx.navigateTo({
                    url: '../user/user'
                })
            } else {
                //注册登录
                wx.redirectTo({
                    url: '../wxlogin/wxlogin'
                })
            }
        } else if (id == 28) {
            //切换列表页
            wx.navigateTo({
                url: '../displayNum/displayNum'
            })

        } else if (id == 15) {
            //使用说明
            wx.navigateTo({
                url: '../explain/explain'
            })
        } else if (id == 16) {
            //注册登录
            wx.getSetting({
                success(res) {
                    if (!(res.authSetting["scope.userInfo"] == true || typeof (res.authSetting["scope.userInfo"]) == "undefined") || !(res.authSetting["scope.userLocation"] == true || typeof (res.authSetting["scope.userLocation"]) == "undefined")) {
                        wx.openSetting({
                            success: (res)=>{if (!(res.authSetting["scope.userInfo"] == true || typeof (res.authSetting["scope.userInfo"]) == "undefined")){
                            wx.showToast({
                                title: '请给于用户信息权限',
                                icon: 'loading',
                                duration: 4000,
                            })
                        }
                    //else
                        if (!(res.authSetting["scope.userLocation"] == true || typeof (res.authSetting["scope.userLocation"]) == "undefined")) {
                            wx.showToast({
                                title: '请给于地理位置权限',
                                icon: 'loading',
                                duration: 4000,
                            })
                        } else {
                            //这里是授权成功之后 填写你重新获取数据的js
                            wx.getLocation({
                                type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
                                success: function (res) {
                                    var latitude = res.latitude
                                    var longitude = res.longitude
                                    var point = {
                                        latitude: latitude,
                                        longitude: longitude
                                    };
                                    that.setData({
                                        'point': point
                                    })
                                }
                            })
                            wx.getUserInfo({
                                success: function (res) {
                                    wx.setStorageSync('user_info', res.userInfo)
                                    console.log(wx.getStorageSync('user_info'));
                                    wx.redirectTo({
                                        url: '../wxlogin/wxlogin'
                                    })
                                }
                            })
                        }
                    }
                    })
                    } else {
                        wx.redirectTo({
                            url: '../wxlogin/wxlogin'
                        })
                    }
                },

            })

        }
    },

    //------------yh_statrt---------------------
    //扫描二维码返回的事件
    scanBikeQr: function () {
        var that = this
        //检查网络
        if (checkNetWork.checkNetWorkState() == false) {
            console.log('网络错误')
        } else {
            wx.request({
                url: config.user.unlock_check,
                data: that.data.stationParams,
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    // success
                    //  wx.setStorageSync('use_record_one', res.data.data.use_record) //用户使用记录id

                    console.log(res.data);
                    var content = res.data.data
                    var message = res.data.code_info
                    var statu = res.data.re_code
                    var use_record_num = content.use_record_num
                    console.log(content)
                    if (statu == 400) //没有借伞
                    {
                        if (use_record_num == 0) {//没有借伞记录
                            that.setData({
                                "depositNotEnough": "您还没有充值押金，请前去充值。",
                                "modalFlag": true,
                                "modalFlag1": true,
                                "modalFlag2": true,
                                "modalFlag3": true,
                                "modalFlag4": false,
                                "toUsageLogHidden": true,
                                "is_show": false
                            })
                            console.log(that.data.toUsageLogHidden)
                        } else if (content.wait_num != 0) {
                            that.setData({
                                "depositNotEnough": "您的还伞未被确认,请您等待确认或者充值押金",
                                "modalFlag": true,
                                "modalFlag1": true,
                                "modalFlag2": true,
                                "modalFlag3": true,
                                "modalFlag4": false,
                                "toUsageLogHidden": true,
                                "is_show": false

                            })
                        } else {
                            that.setData({
                                "depositNotEnough": "您的押金已借完，请前去还伞或者前去充值",
                                "modalFlag": true,
                                "modalFlag1": true,
                                "modalFlag2": true,
                                "modalFlag3": true,
                                "modalFlag4": false,
                                "toUsageLogHidden": false,
                                "is_show": false

                            })
                        }
                    } else if (statu == 200) //借伞成功
                    {
                        that.setData({
                            "stationParams.use_record_id": content.use_record_id, //刷新就没有了
                            "is_show": false
                        })
                        that.timing() //开始计时方法

                    }
                },
                fail: function () {
                    // fail
                    that.failMessage()
                },
                complete: function () {
                    // complete
                }
            })
        }
    },
    //取消充值还伞那个确认
    cansel: function (e) {
        var that = this
        //初始化操作
        that.setData({
            "modalFlag": true,
            "modalFlag1": true,
            "modalFlag2": true,
            "modalFlag3": true,
            "modalFlag4": true,
            "toUsageLogHidden": true,
            "is_show": true
        })
        that.onShow();
    },
    //计时方法
    timing: function (e) {
        var that = this
        //初始化操作
        that.setData({
            "modalFlag1": false,
            "modalFlag": true,
            "modalFlag2": true,
            "modalFlag3": true,
            "modalFlag4": true,
            "hasLoginMapControls[4].iconPath": '../../../images/user2.png',
            "is_show": false,
            time: 3,
            hours: 0,
            minuters: 0,
            seconds: 0
        })

        clearInterval(that.timer)
        let time = 3;
        that.timer = setInterval(() => {
                that.setData({
                time: --time
            });
        // 读完秒后携带单车号码跳转到计费页
        if (time < 0) {
            clearInterval(that.timer)

            that.setData({
                billing: "本次用伞计时",
                timer: this.timer,
                modalFlag: false,
                modalFlag1: true,
                modalFlag2: true,
                modalFlag3: true,
                modalFlag4: true

            })
            // 初始化计时器
            let s = 0;
            let m = 0;
            let h = 0;
            this.timer = setInterval(() => {
                    this.setData({
                    seconds: s++
                })
            if (s == 60) {
                s = 0;
                m++;
                setTimeout(() => {
                    this.setData({
                    minuters: m
                });
            },
                1000
            )
                if (m == 60) {
                    m = 0;
                    h++
                    setTimeout(() => {
                        this.setData({
                        hours: h
                    });
                },
                    1000
                )
                }
            }
            ;
        },
            1000
        )
        }
    },
        1000
        )
    },

    //------------------yh_end-----------------------------
    /*位置变化的时候*/
    regionchange: function (e) {
        //得到地图中心点的位置
        var that = this;
        console.log(that);
        that.mapCtx.getCenterLocation({
            success: function (res) {
                //调试发现地图在滑动屏幕开始和结束的时候都会走这个方法,需要判断位置是否真的变化来判断是否刷新单车列表
                //经纬度保留6位小数
                var longitudeFix = res.longitude.toFixed(6)
                var latitudeFix = res.latitude.toFixed(6)
                if (e.type == "begin") {
                    console.log('位置相同,不执行刷新操作')
                } else {
                    console.log("位置变化了")
                    var checksum = that.data.getBikeListParams.token + longitudeFix + latitudeFix + that.data.SALT
                    var checksumMd5 = md5.hexMD5(checksum)
                    that.setData({
                        'getBikeListParams.longitude': longitudeFix,
                        'getBikeListParams.latitude': latitudeFix,
                        'getBikeListParams.checksum': checksumMd5
                    })
                    //刷新单车列表
                    if (that.data.isCanGetBikeList) {
                        // that.getBikeList()
                    }
                }
            }
        })
    },

    //点击标注点
    markertap: function (e) {
        console.log(e.markerId)
    },

    //定位到用户当前位置
    getUserCurrentLocation: function () {
        this.mapCtx.moveToLocation();
        this.setData({
            'mapScale': 16
        })
    },

    /*加载失败*/
    failMessage: function (e) {
        wx.showToast({
            title: e,
            icon: 'loading',
            duration: 2000,
        })
    },

    //获得用户使用记录的事件
    getRecord: function () {
        //检查网络
        if (checkNetWork.checkNetWorkState() == false) {
            console.log('网络错误')
        } else {
            var that = this
            wx.request({
                url: config.user.get_useRecord,
                data: that.data.stationParams,
                method: 'POST',
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var content = res.data.data; //返回数据
                    var message = res.data.code_info; //提示码对应的信息
                    var statu = res.data.re_code; //返回提示码                  
                    if (statu != 200) {
                        wx.showToast({
                            title: message,
                            icon: 'loading',
                            duration: 2000,
                        })
                        that.setData({
                            'stationParams.station_end': 0,//站点id
                            'stationParams.admin_id': 0,//管理员id
                            'stationParams.flag': 0,//标志
                            'is_show': true
                        });

                        setTimeout(function () {
                            that.onShow();
                        }, 2000)


                    } else {
                        that.setData({
                            'stationParams.admin_id': content.admin_id,//管理员id
                            'stationParams.flag': content.flag,//标志
                        });

                        that.setData({
                            billing: "本次使用耗时",
                            "total_time": res.data.data.total_time, //总的耗时
                            "total_fee": res.data.data.total_fee,
                            "modalFlag": true,
                            "modalFlag1": true,
                            "modalFlag2": false,
                            "modalFlag3": true,
                            "modalFlag4": true,
                            "toUsageLogHidden": true,
                            confirmTime: 60,
                        })
                        clearInterval(that.contimes);
                        let time = 60;
                        that.contimes = setInterval(() => {
                                that.setData({
                                confirmTime: --time
                            });
                        if (that.data.confirmTime < 0) {
                            clearInterval(that.contimes)
                            that.setData({
                                'stationParams.use_record_id': 0,//未完成订单id
                                'stationParams.station_end': 0,//站点id
                                'stationParams.admin_id': 0,//管理员id
                                'stationParams.flag': 0,//标志
                                'is_show': true

                            });
                            that.onShow();
                        }
                    },
                        1000
                    )
                    }
                },
                fail: function () {
                    // fail
                    that.failMessage('请求失败')
                },

            })
        }
    },
    /*立即还伞/确认支付*/
    payUse: function () {
        //检查网络
        if (checkNetWork.checkNetWorkState() == false) {
            console.log('网络错误')
        } else {
            var that = this
            wx.request({
                url: config.user.lock_check,
                data: that.data.stationParams, //也许会存在逻辑错误
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    // success
                    var content = res.data.data //提示码对应的信息
                    var message = res.data.code_info //提示码对应的信息
                    var statu = res.data.re_code //返回提示码
                    var info = res.data.code_info //返回提示码
                    if (statu == 400) //余额不足
                    {
                        //跳转到余额界面
                        wx.showModal({
                            title: '',
                            content: '您的余额不足，请充值。',
                            showCancel: true,
                            cancelText: '取消',
                            cancelColor: '#7CCD7C',
                            confirmText: '确定',
                            confirmColor: '#7EC0EE',
                            success: function (res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '../wallet/wallet'
                                    })
                                } else if (res.cancel) {

                                }
                            },
                            fail: function (res) {
                            },
                            complete: function (res) {
                            },
                        })

                    } else if (statu == 200) {//还伞成功
                        that.setData({
                            'stationParams.use_record_id': 0,//未完成订单id
                            'stationParams.station_end': 0,//站点id
                            'stationParams.admin_id': 0,//管理员id
                            'stationParams.flag': 0,//标志
                        });
                        wx.redirectTo({
                            url: '../cost/cost?pay_method=' + content.mark + '&second=' + that.data.total_time.second + '&hour=' + that.data.total_time.hour + '&minute=' + that.data.total_time.minute + '&total_fee=' + that.data.total_fee + '&flag' + content.flag
                        })
                    } else {
                        wx.showToast({
                            title: info,
                            icon: 'loading',
                            duration: 3000,
                            mask: true
                        })
                    }
                },
                fail: function () {
                    that.failMessage()
                },
                complete: function () {
                    // complete
                }
            })
        }
    },
    /*    页面加载的函数*/
    onLoad: function (e) {
        console.log('onLoad');
        console.log(e);
        var that = this;
        var login_state = wx.getStorageSync('login_state')
        that.setMarkers();
        console.log(that.data.markers)
        if (login_state == 3) {
            if (e && e.station_end && e.use_record_id) {//从使用记录跳转过来

                that.setData({
                    'stationParams.use_record_id': e.use_record_id,//未完成订单id
                    'stationParams.station_end': e.station_end,//站点id
                    'is_show': false
                });
                that.getRecord();
            } else {
                // //向后台请求获取是否有正在使用记录
                // wx.request({
                //   url: config.user.get_record_time,
                //   data: {},
                //   method: 'POST',
                //   header: {
                //     'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                //     'content-type': 'application/x-www-form-urlencoded'
                //   },
                //   success: function (res) {
                //     // success
                //     var content = res.data.data; //返回数据
                //     var statu = res.data.re_code; //返回提示码
                //     if (statu == 200) {
                //       if (content.use_record_num == 1) {
                //         // 初始化计时器
                //         that.setData({
                //           "hasLoginMapControls[4].iconPath": '../../../images/user2.png',
                //           "stationParams.use_record_id": content.use_record_id, //设置该记录id
                //           'seconds': content.second,
                //           'minuters': content.minute,
                //           'hours': content.hour,
                //           "modalFlag": false,
                //           "modalFlag1": true,
                //           "modalFlag2": true,
                //           "modalFlag3": true,
                //           "modalFlag4": true,
                //           "toUsageLogHidden": false,
                //         })

                //         var s = content.second;
                //         var m = content.minute;
                //         var h = content.hour;
                //         that.timer = setInterval(() => {
                //           that.setData({
                //             seconds: s++
                //           })
                //           if (s == 60) {
                //             s = 0;
                //             m++;
                //             setTimeout(() => {
                //               that.setData({
                //                 minuters: m
                //               });
                //             }, 1000)
                //             if (m == 60) {
                //               m = 0;
                //               h++
                //               setTimeout(() => {
                //                 that.setData({
                //                   hours: h
                //                 });
                //               }, 1000)
                //             }
                //           };
                //         }, 1000)
                //       } else {
                //         that.setData({
                //           "hasLoginMapControls[4].iconPath": '../../../images/user2.png',
                //           "stationParams.use_record_id": content.use_record_id, //设置该记录id
                //           billing: "正在使用伞数",
                //           useNumber: content.use_record_num,
                //           "modalFlag": true,
                //           "modalFlag1": true,
                //           "modalFlag2": true,
                //           "modalFlag3": false,
                //           "modalFlag4": true
                //         })
                //       }
                //     } else if (statu == 400) { //没有伞要还
                //       clearInterval(this.timer)
                //       that.setData({
                //         "hasLoginMapControls[4].iconPath": '../../../images/user.png',
                //         "modalFlag": true,
                //         "modalFlag1": true,
                //         "modalFlag2": true,
                //         "modalFlag3": true,
                //         "modalFlag3": true,
                //         "toUsageLogHidden": true,
                //       })
                //     }

                //   },
                //   fail: function () {
                //     // fail
                //     that.failMessage()
                //   },
                // })
            }
        }
        /************yh_start*************/


        //计算屏幕的高度
        // var h = 1
        // var top = h * 0.25 * 0.7
        // var bottom = h * 0.25 * 0.3
        // that.setData({
        //     'bikeRiding.topLineHeight': top,
        //     'bikeRiding.bottomLineHeight': bottom
        // })
        //如果APP被微信强制关闭或异常杀死,重启的情况下,检查用户的用车状态
        //如果未登录,则不做处理,否则请求查询接口

    },
    setMarkers: function () {
        var that = this;
        wx.request({
            url: config.user.get_station_location,
            data: {},
            method: 'POST',
            header: {},
            success: function (res) {
                var content = res.data.data; //返回数据
                var message = res.data.code_info; //提示码对应的信息
                var statu = res.data.re_code; //返回提示码

                if (statu == 200) {
                    console.log("asdad");
                    that.setData({
                        markers: content.markers
                    });

                } else {
                    wx.showToast({
                        title: message,
                        icon: 'loading',
                        duration: 2000,
                    })
                }
            },
        })
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        var networkStatu = checkNetWork.checkNetWorkState()

        //获取用户的当前位置位置
        wx.getLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
            success: function (res) {

                var latitude = res.latitude
                var longitude = res.longitude
                var point = {
                    latitude: latitude,
                    longitude: longitude
                };
                that.setData({
                    'point': point
                })
            },
            cancel: function () {
                console.log("地理执行")
                wx.setStorageSync('login_state', 0)//未授权
                // this.globalData.login_state = 0;
            }
        })

        //最长的延时时间
        wx.showToast({
            title: '正在加载',
            icon: 'loading',
            duration: 2000,
            mask: true
        })
        console.log('onShow')
        var that = this
        console.log(that)
        //获取登陆状态
        //2.显示骑行中的视图,隐藏map控件

        var login_state = wx.getStorageSync('login_state')
        //完成界面的加载
        if (login_state == 3) {
            console.log('onShow22')
            //表示已登录
            //已登录的map组件
            var hasLoginMapControls = that.data.hasLoginMapControls;
            //红包记录
            wx.request({
                url: config.user.redbag_notice,
                data: {},
                method: 'POST',
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var content = res.data.data; //返回数据
                    var message = res.data.code_info; //提示码对应的信息
                    var statu = res.data.re_code; //返回提示码

                    if (statu == 200) {
                        that.setData({
                            'marker': content.redbag_num,
                            'rgnum': content.redbag_num
                        })
                    }
                }
            });
            //用伞记录
            //向后台请求获取是否有正在使用记录
            console.log(that.data.is_show)
            if (that.data.is_show == true) {
                wx.request({
                    url: config.user.get_record_time,
                    data: {},
                    method: 'POST',
                    header: {
                        'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        // success
                        var content = res.data.data; //返回数据
                        var statu = res.data.re_code; //返回提示码
                        if (statu == 200) {
                            if (content.use_record_num == 1) {
                                // 初始化计时器
                                that.setData({
                                    "hasLoginMapControls[4].iconPath": '../../../images/user2.png',
                                    "stationParams.use_record_id": content.use_record_id, //设置该记录id
                                    'seconds': content.second,
                                    'minuters': content.minute,
                                    'hours': content.hour,
                                    "modalFlag": false,
                                    "modalFlag1": true,
                                    "modalFlag2": true,
                                    "modalFlag3": true,
                                    "modalFlag4": true,
                                    "toUsageLogHidden": false,

                                })
                                clearInterval(that.timer);
                                var s = content.second;
                                var m = content.minute;
                                var h = content.hour;
                                that.timer = setInterval(() => {
                                        that.setData({
                                        seconds: s++
                                    })
                                if (s == 60) {
                                    s = 0;
                                    m++;
                                    setTimeout(() => {
                                        that.setData({
                                        minuters: m
                                    });
                                },
                                    1000
                                )
                                    if (m == 60) {
                                        m = 0;
                                        h++
                                        setTimeout(() => {
                                            that.setData({
                                            hours: h
                                        });
                                    },
                                        1000
                                    )
                                    }
                                }
                                ;
                            },
                                1000
                            )
                            } else {
                                that.setData({
                                    "hasLoginMapControls[4].iconPath": '../../../images/user2.png',
                                    "stationParams.use_record_id": content.use_record_id, //设置该记录id
                                    billing: "正在使用伞数",
                                    useNumber: content.use_record_num,
                                    "modalFlag": true,
                                    "modalFlag1": true,
                                    "modalFlag2": true,
                                    "modalFlag3": false,
                                    "modalFlag4": true
                                })
                            }
                        } else if (statu == 400) { //没有伞要还
                            clearInterval(that.timer)
                            that.setData({
                                "hasLoginMapControls[4].iconPath": '../../../images/user.png',
                                "modalFlag": true,
                                "modalFlag1": true,
                                "modalFlag2": true,
                                "modalFlag3": true,
                                "modalFlag3": true,
                                "toUsageLogHidden": true,
                            })
                        }

                    },
                    fail: function () {
                        // fail
                        that.failMessage()
                    },
                })
            }

            //2.显示骑行中的视图,隐藏map控件
            that.setData({
                'controls': hasLoginMapControls,
            })
            //隐藏加载图
            wx.hideToast()
        } else {
            //没有登录
            //未登录的map组件
            var notLoginMapControls = that.data.notLoginMapControls;
            //所有数据恢复到初始值
            console.log(notLoginMapControls);
            that.setData({
                'controls': notLoginMapControls,
                //地图的宽高
                "mapHeight": '100%',
                "mapWidth": '100%',
                "mapTop": '0',
                //正在骑行中的视图的属性
                "bikeRiding": {
                    show: false,
                    ridingTime: 0,
                    ridingDistance: 1.2,
                    ridingSpeed: 5.0,
                    height: '25%',
                    width: '100%',
                    topLineHeight: "0rpx",
                    bottomLineHeight: "0rpx",
                },
                //计费异常的视图的属性
                "bikeAbnormity": {
                    show: false,
                },
            })
            //隐藏加载图
            wx.hideToast()
        }
    },

    //跳转到还伞界面
    rerunRide: function () {
        wx.navigateTo({
            url: '../usageLog/usageLog',
        })
    },
    //点击通知，去红包
    toRedbag: function () {
        wx.navigateTo({
            url: '../redbag/redbag',
        })
    },
    //
    packUp: function () {
        this.setData({
            "modalFlag": true,
            "modalFlag1": true,
            "modalFlag2": true,
            "modalFlag3": true,
            "modalFlag4": true
        });
        // wx.redirectTo({
        //   url: '../index/index',
        // })
        console.log(2)
    },

    /*toUsageLog--押金不足，去还伞*/
    toUsageLog: function () {
        wx.navigateTo({
            url: '../usageLog/usageLog',
        })
    },
    /*toDeposit--押金不足，充押金*/
    toDeposit: function () {
        wx.navigateTo({
            url: '../deposit/deposit',
        })
    },

    //点击立即还伞，确认支付
    /*********yh_start**********/
    endRide: function () {
        var that = this;
        console.log("确认支付");
        clearInterval(that.timer);

        wx.scanCode({
            success: function (res) {
                that.setData({

                    'stationParams.station_end': res.result, //站点id
                })
                that.getRecord(); //跳转到确认界
            },

            fail: function () {
                wx.showToast({
                    title: '扫码失败',
                    icon: 'loading',
                    duration: 2000,
                })
            },

        })
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
        console.log('onHide')
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
        console.log('onUnload')
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
        console.log('onPullDownRefresh')
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
        console.log('onReachBottom')
    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        console.log('onShareAppMessage')
        return {
            desc: '', // 分享描述
            path: '/index/index' // 分享路径
        }
    }
})
