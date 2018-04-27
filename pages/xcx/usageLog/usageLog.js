//获取应用实例
var app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var itemWidht = 300;
var checkNetWork = require("../../../utils/checkNetWork.js")
var config = require("../../../config")
Page({
    data: {
        /*** 页面配置 */
        loadText1: '',
        loadText2: "",
        containerHeight1: '',
        containerHeight2: '',
        hideFlag1: false,
        hideFlag2: false,
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        // 未完成订单数据，可改为从后台获取
        unfinishedOrder: '',
        // 已完成订单数据，可改为从后台获取
        finishedOrder: '',
        tabs: ["使用中", "已完成"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        row1: 0,
        row2: 0,
        //请求伞点的关锁参数
        stationParams: {
            use_record_id: '',
            station_end: '',
            datetime_end: '',
        },
        uploads_url: config.uploads
    },
    onLoad: function () {
        var that = this;
        /**  * 获取系统信息 */
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight,
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });

        /********yh_start_返回订单信息*******/
        wx.request({
            url: config.user.use_record,
            data: that.data.stationParams,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT

            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var content = res.data.data
                var statu = res.data.re_code

                console.log(res.data)
                //未完成订单
                if (content.using.length > 4) {
                    that.setData({
                        loadText1: "加载更多",
                        unfinishedOrder: content.using.splice(that.data.row1, that.data.row1 + 4),
                        row1: that.data.row1 + 4,
                        containerHeight1: itemWidht * (that.data.row1 + 4) + 100
                    })
                    console.log(that.data.row1)
                    console.log(that.data.unfinishedOrder)
                } else {
                    that.setData({
                        loadText1: "没有更多数据了",
                        hideFlag1: true,
                        unfinishedOrder: content.using,
                        row1: content.using.length,
                        containerHeight1: itemWidht * content.using.length + 100//
                    });
                }
                //已完成订单
                if (content.finished.length > 4) {
                    that.setData({
                        loadText2: "加载更多",
                        finishedOrder: content.finished.splice(that.data.row2, that.data.row2 + 4),
                        row2: that.data.row2 + 4,
                        containerHeight2: itemWidht * (that.data.row2 + 4) + 100
                    })
                    console.log(that.data.row2)
                    console.log(that.data.finishedOrder)
                }

                else {
                    that.setData({
                        loadText2: "没有更多数据了",
                        hideFlag2: true,
                        finishedOrder: content.finished,
                        row2: content.finished.length,
                        containerHeight2: itemWidht * content.finished.length + 100
                    });
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
    },
    //去赞助商
    toSponsor: function (e) {
        var that = this;
        console.log(e);
        wx.navigateTo({
            url: '../sponsor/sponsor?sponsor_id=' + e.currentTarget.dataset.sp
        })
    },

    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    setLoading1: function (e) {
        var that = this
        var unfinishedOrderBefore = this.data.unfinishedOrder

        wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
            title: '加载中',
            icon: 'loading',
            duration: 200
        })

        wx.request({
            url: config.user.use_record,
            data: that.data.stationParams,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var content = res.data.data
                var statu = res.data.re_code
                console.log(res.data);
                //未完成订单
                if (content.using.length > that.data.row1) {
                    that.setData({
                        loadText1: "数据请求中",
                        loading: true,
                        row1: that.data.row1 + 4,
                        unfinishedOrder: content.using.splice(0, that.data.row1 + 4),
                        containerHeight1: itemWidht * (that.data.row1 + 4) + 100,
                        loadText1: "加载更多",
                        loading: false
                    });
                }
                else {
                    that.setData({
                        loadText1: "没有更多数据了",
                        hideFlag1: true,
                        loading: false,
                        unfinishedOrder: unfinishedOrderBefore,
                        loadText1: "没有更多数据了",
                        loading: false
                    });
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
    },
    setLoading2: function (e) {
        var that = this
        var finishedOrderBefore = this.data.finishedOrder

        wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
            title: '加载中',
            icon: 'loading',
            duration: itemWidht
        })
        wx.request({
            url: config.user.use_record,
            data: that.data.stationParams,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT

            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var content = res.data.data
                var statu = res.data.re_code
                if (content.finished.length > that.data.row2) {
                    //已完成订单

                    that.setData({
                        loadText2: "数据请求中",
                        loading: true,
                        row2: that.data.row2 + 4,
                        finishedOrder: content.finished.splice(0, that.data.row2 + 4),
                        containerHeight2: itemWidht * (that.data.row2 + 4) + 100,
                        loadText2: "加载更多",
                        loading: false,
                    });
                }
                else {
                    that.setData({
                        loadText2: "没有更多数据了",
                        hideFlag2: true,
                        loading: false,
                        finishedOrder: finishedOrderBefore,
                        loadText2: "没有更多数据了",
                        loading: false
                    });
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

    },
    /** * 滑动切换tab*/
    bindChange: function (e) {

        var that = this;
        that.setData({currentTab: e.detail.current});
        console.log("y" + e.detail.current);

    },
    /*** 点击tab切换 */
    swichNav: function (e) {

        var that = this;

        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    /********yh_start*******/
    binScan: function (e) {//扫码还伞
        var that = this;
        wx.scanCode({
            success: function (res) {
              console.log(res.result)
                that.setData({
                    'stationParams.use_record_id': e.currentTarget.dataset.useRecord,//未完成订单id
                    'stationParams.station_end': res.result,//站点id
                })
                //跳转到确支付界面
                wx.reLaunch({
                    url: '../index/index?use_record_id=' + e.currentTarget.dataset.useRecord + '&station_end=' + res.result
                })
                // 扫码之后请求接口
                // that.scanBikeQr()
            },

            fail: function () {
                wx.showToast({
                    title: '扫码失败',
                    icon: 'loading',
                    duration: 2000,
                })
            },
            complete: function () {

            }
        })
        /********yh_end*******/

    },

    //------------yh_statrt---------------------
    //扫描二维码返回的事件
    scanBikeQr: function () {
        //检查网络
        if (checkNetWork.checkNetWorkState() == false) {
            console.log('网络错误')
        } else {

            var that = this
            wx.request({
                url: config.user.lock_check,
                data: that.data.stationParams,
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    // success
                    var message = res.data.code_info//提示码对应的信息
                    var statu = res.data.re_code//返回提示码
                    if (statu == 400)//余额不足
                    {
                        //跳转到余额界面
                        wx.redirectTo({
                            url: '../wallet/wallet'
                        })
                    }
                    else if (statu == 200)//可以还伞
                    {
                        wx.redirectTo({
                            url: '../jssucess/jssucess'
                        })
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
    //------------------yh_end-----------------------------

})
