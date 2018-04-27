var md5 = require("../../../utils/MD5.js")
var config = require('../../../config');
Page({
    data: {
        pay: 0.0,
        time: 0,
        wallet: 0,
        redbag: 0,
        flag: 0,
        pay_method: "余额",
        //查询余额接口

        //校验码
        SALT: "AIRBIKESALT",
    },
    /********yh_start***********/
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var that = this
        console.log(options.total_time);
        var method = "余额"
        if (options.pay_method == 6) {
            method = "红包"
        }
        that.setData({
            "pay_method": method,
            "pay": options.total_fee,
            "hour": options.hour,
            "minute": options.minute,
            "second": options.second,
            "flag": options.flag
        })
        //查询余额
        // var token = wx.getStorageSync('token') || ''
        wx.request({
            url: config.user.my_wallet,
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // 设置请求的 header
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var statu = res.data.re_code
                if (statu == 200) {
                    //查询成功
                    that.setData({
                        "wallet": res.data.data.over,
                        "redbag": res.data.data.redbag,

                    })
                } else {
                    //查询失败
                    wx.showToast({
                        title: '获取余额失败,可前往个人钱包查询',
                        icon: 'loading',
                        duration: 3000,
                    })
                }
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    /********yh_end***********/
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示

    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            desc: '我刚刚使用AriBike完成了一场愉快的骑行,朋友们一起来体验一下吧', // 分享描述
            path: '/cost/cost' // 分享路径
        }
    },
    //完成
    finishAct: function () {
        wx.redirectTo({
            url: '../index/index'//yh跳转到主页
        })
        // wx.navigateBack({delta: 2})
    }
})
