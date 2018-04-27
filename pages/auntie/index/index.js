var checkNetWork = require("../../../utils/checkNetWork.js");
var config = require('../../../config');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
    data: {
        //接口
        noticeRecord: [{'title': '', 'datetime': '', 'content': ''}],
        qr_url: ''
    },
    onLoad: function () {
        var that = this;
        /********返回用户信息*******/
        wx.request({
            url: config.auntie.notice,
            data: {},
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

                var statu = res.data.re_code;
                console.log(res)
                console.log(res.data)
                if (statu == 200) {
                    that.setData({
                        noticeRecord: res.data.data.notice_list
                    });
                }
            },
            fail: function () {
                console.log("fail")
                // fail
                // that.failMessage()
            },
            complete: function () {
                console.log("complete")
                // complete
            }
        })
        that.getQr();
    },
    onShow: function () {
        //自动加载
        var that = this;
        this.timer = setInterval(() => {
                that.getQr()
    },
        60000
        )
        console.log('onShow')
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
        clearInterval(this.timer);
        console.log('onHide')
    },
    //更新二维码
    getQr: function () {
        if (checkNetWork.checkNetWorkState() == false) {
            console.log('网络错误')
        } else {
            var that = this;
            wx.request({
                url: config.auntie.update_qr,
                data: {},
                method: 'POST',
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    var statu = res.data.re_code;
                    console.log(res.data)
                    if (statu == 200) {
                        that.setData({
                            qr_url: res.data.data.img_code
                        });
                    }
                },
                fail: function () {
                    console.log("fail")
                },
                complete: function () {

                }
            })
        }
    }

    // //下拉刷新
    // onPullDownRefresh: function () {
    //   var that = this;
    //   wx.startPullDownRefresh(

    //     wx.showToast({
    //       title: '加载中',
    //       icon: 'loading',
    //       duration: 1000
    //     }),
    //     wx.request({
    //       url: config.auntie.notice,
    //       data: {},
    //       method: 'POST',
    //       header: {
    //         'authenticate': wx.getStorageSync('client_sign'), //唯一标识
    //         'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       success: function (res) {
    //         var statu = res.data.re_code;
    //         console.log(res)
    //         console.log(res.data)
    //         if (statu == 200) {
    //           that.setData({
    //             noticeRecord: res.data.data.notice_list
    //           });
    //         }
    //       },
    //       fail: function () {
    //         // fail
    //         that.failMessage()
    //       },

    //     })

    //   )

    // },

});
