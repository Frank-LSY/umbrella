// translationDetail.js
var config = require('../../../config');
Page({

    /**
     * 页面的初始数据
     */
    data: {

        finishedOrder: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        wx.request({
            url: config.user.pay_record,
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // 设置请求的 header
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                console.log('kdfjakjfd')
                console.log(res.data)
                var content = res.data.data
                console.log(content)
                var message = res.data.code_info
                var statu = res.data.re_code
                var consumptionType = ""
                if (statu == 200) {//查询成功
                    // that.setData({
                    //   "wallet": content.over,//从后台获取余额
                    //   "deposit": content.deposit//从后台获取押金
                    // })
                    for (var i = 0; i < content.length; i++) {
                        if (content[i].mark === '1') {
                            content[i].consumptionType = "充押金"
                        }
                        else if (content[i].mark === '2') {
                            content[i].consumptionType = "退押金"
                        }
                        else if (content[i].mark === '3') {
                            content[i].consumptionType = "充余额"
                        }
                        else if (content[i].mark === '4') {
                            content[i].consumptionType = "消费余额"
                        }
                        else if (content[i].mark === '5') {
                            content[i].consumptionType = "退款中"
                        }
                        else if (content[i].mark === '6') {
                            content[i].consumptionType = "消费红包"
                        }

                    }


                    that.setData({
                        "finishedOrder": content
                    })

                }
                //检查是否登录失效
                else if (statu == 400) {
                    disabledToken.reLogin(-2)
                }
            },
            fail: function () {
                // fail
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})