var md5 = require("../../../utils/MD5.js")
var checkNetWork = require("../../../utils/checkNetWork.js")
var config = require('../../../config');
var app = getApp()
var inputValue = ''
var register_url = 'http://192.168.0.121/git/wx/xcx/index.php/login/check_register'
Page({
    data: {
        registerParams: {
            mobile: '',
            code: '',
            checksum: ''
        },
        showModalStatus: false,
        uesrTel: '18717106428',
    },

    onLoad: function (options) {
        // 生命周期函数--监听页面加载

    },
    /*更换手机号*/
    changeTel: function () {
        wx.redirectTo({
            url: '../Register/Register'
        })
    },
    /*打开模态框*/
    showModal: function () {
        this.setData({
            showModalStatus: true
        });
    },
    /*关闭模态框*/
    closeModal: function () {
        this.setData({
            showModalStatus: false
        });
    },
    wxloginModal: function (e) {
        var that = this;
        console.log(app.globalData.login_state);
        if (app.globalData.login_state == 2) {
            wx.request({
                url: app.globalData.lotusUrl.wxlogin,
                data: {},
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                },
                success: function (res) {
                    // success
                    console.log("成功" + res.data)
                    app.globalData.login_state = 3; //已登陆标识
                    wx.redirectTo({
                        url: '../index/index'
                    })

                },
                fail: function (res) {
                    // fail
                    console.log(res)
                    // that.failMessage()
                },
                complete: function () {

                }
            })
        } else if (app.globalData.login_state == 1) {
            wx.redirectTo({
                url: '../Register/Register'
            })
            wx.getUserInfo({
                success: function (res) {
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    console.log(res)
                    console.log(userInfo)
                    console.log(res.rawData)
                    console.log(res.signature)
                    console.log(res.encryptedData)
                    console.log(res.iv)

                }
            })
            console.log(e)
            var currentStatu = e.currentTarget.dataset.statu;
            console.log(currentStatu)
            this.util(currentStatu)
        }

    },

    bindKeyInput: function (e) {
        console.log(e.detail.value);

    },
    wxloginDetermine: function (e) {

        var that = this;
        var nickname = null;
        var avatarUrl = null;
        if (app.globalData.user_info.length > 0) {
            nickname = app.globalData.user_info.nickName;
            avatarUrl = app.globalData.user_info.avatarUrl;
        }
        console.log(app.globalData.user_info.nickName);
        // 如果用户没有授权获得个人信息，这里要判断，没有就自己付一个初始值
        wx.request({
            url: config.auntie.registerUrl,
            data: {'mobile': '', 'nickname': nickname, 'head': avatarUrl},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'authenticate': wx.getStorageSync('client_sign')
            }, // 设置请求的 header
            success: function (res) {
                console.log(res)
                app.globalData.login_state = 3; //已登陆标识
                var wechat = res.data.data.wechat; //获取用户id
                wx.setStorageSync('wechat', wechat)
                wx.redirectTo({
                    url: '../index/index'
                })
                console.log(res.data);
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })

    },
    /*绘制模太框*/
    util: function (currentStatu) {
        /* 动画部分 */
        // 第1步：创建动画实例
        var animation = wx.createAnimation({
            duration: 200, //动画时长
            timingFunction: "linear", //线性
            delay: 0 //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画
        animation.opacity(0).rotateX(-100).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
            // 执行第二组动画
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

            //关闭
            if (currentStatu == "close") {
                this.closeModal();
                // this.setData({
                //     showModalStatus: false
                // });
            }
        }.bind(this), 200)

        // 显示
        if (currentStatu == "open") {
            this.showModal();
            // this.setData({
            //     showModalStatus: true
            // });
        }
    },

    /*微信授权登录*/

    //注册登录
    wxlogin: function () {
        //光标取消
        var that = this
        that.setData({
            'codeTfFocus': true
        })
        //请求接口
        if (checkNetWork.checkNetWorkState() == false) {
            console.log('网络错误')
        } else {
            // wx.redirectTo({
            //         url: '../wxloginModal/wxloginModal'
            //     })
            //  wx.showModal({
            //           title: '微信手机号授权',
            //           content: '申请获取你的手机号',
            //           success: function(res) {
            //               if (res.confirm) {
            //                   console.log('用户点击确定');
            //                   wx.login({
            //                       success: function(res) {
            //                           console.log(res);
            //                           if (res.code) {
            //                               //发起网络请求
            //                               console.log('获取用户登录态成功！' + res.code)
            //                               wx.request({
            //                                   url: 'https://test.com/onLogin',
            //                                   data: {
            //                                       code: res.code
            //                                   }
            //                               });
            //                               wx.showToast({
            //                                   title: '成功',
            //                                   icon: 'success',
            //                                   duration: 2000
            //                               })
            //                           } else {
            //                               console.log('获取用户登录态失败！' + res.errMsg)
            //                           }
            //                       }
            //                   });
            //               } else if (res.cancel) {
            //                   console.log('用户点击取消')
            //               }
            //           }
            //       })

        }
    },
})
