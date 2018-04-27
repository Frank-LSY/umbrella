var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
//var base64 = require("../../../images/base64");
var config = require('../../../config');
var app = getApp();
Page({
    data: {
        true_name: '',
        head: '',
        wage: '',
        is_edit: false
    },
    onLoad: function () {
        var that = this;
        console.log(that)
        wx.request({
            url: config.auntie.admin_home,
            data: {},
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
                // var age id_card true_name organization sex head
                if (statu == 200) {
                    that.setData({
                        'true_name': content.admin.true_name,
                        'wage': content.admin.wage,
                        'head': content.admin.head,
                        'is_edit': content.is_edit
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

    exit: function () {
        wx.request({ //发起网络请求
            url: config.user.loginUrl,
            data: {},
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var content = res.data.data
                var statu = res.data.re_code
                if (statu == 200 || statu == 501) //表示已登陆
                {
                    if (statu == 501) {//注册用户，但缓存过期,需要重新登陆
                        wx.setStorageSync('client_sign', content.server_sign) //服务器返回的唯一标识
                    }
                    // app.globalData.login_state = 3; //已登陆标识
                    wx.setStorageSync('login_state', 3) //已登陆标识
                    if (content.identity == 'admin') {
                        if (content.is_user == 0) {//默认登陆阿姨端
                            // app.globalData.login_state = 1; //注册标识
                            wx.setStorageSync('login_state', 1) //注册标识
                        }
                    }
                }
            }
        })
        wx.setStorageSync('switch_login', 0) //默认登陆小荷
        wx.reLaunch({ //跳转回登陆界面
            url: '../../xcx/index/index'
        });
    }

});
