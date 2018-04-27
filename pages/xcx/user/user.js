var config = require('../../../config');
Page({
    data: {
        hidden1: true,
        hidden2: true,
        nocancel: false,
        toPonderHidden: "0",
        user: {
            nickname: '未知',
            head: ''
        },
    },
    onLoad: function () {
        var that = this;

        /********yh_start_返回用户信息*******/
        wx.request({
            url: config.user.user_info,
            data: {},
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var content = res.data.data
                var statu = res.data.re_code
                if (content.admin == true) {
                    that.setData({
                        "toPonderHidden": "2"
                    })
                } else if (content.apply == true) {
                    that.setData({
                        "toPonderHidden": "1"
                    })
                }
                if (statu == 200) {
                    that.setData({
                        'user': content,
                        'nickname': content.nickname

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

    toPonder: function () {
        wx.setStorageSync('switch_login', 1) //默认登陆荷塘
        wx.reLaunch({
            url: '../../auntie/index/index'
        });
    },
    //模态框
    showMoadl1: function () {
        this.setData({
            hidden1: false
        });
    },
    cancel1: function () {
        this.setData({
            hidden1: true
        });
    },
    confirm1: function () {
        this.setData({
            hidden2: false
        });
    },
    cancel2: function () {
        this.setData({
            hidden2: true,
            hidden1: true
        });
    },
    confirm2: function () {
        //调用扣除押金的方法
        var that = this
        wx.request({
            url: config.user.deduct_deposit,
            data: {},
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var content = res.data.data
                var statu = res.data.re_code
                var message = res.data.code_info
                that.setData({
                    hidden2: true,
                    hidden1: true
                });
                if (statu == 200) {
                    wx.showToast({
                        title: message,
                        icon: 'success',
                        duration: 2000,
                    })
                } else {
                    wx.showToast({
                        title: message,
                        icon: 'loading',
                        duration: 2000,
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
})
