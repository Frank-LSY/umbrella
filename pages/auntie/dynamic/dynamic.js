var checkNetWork = require("../../../utils/checkNetWork.js");
var config = require('../../../config');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
    data: {
        //接口
        qr_url: '',
        timer: 0
    },
    onLoad: function () {
        var that = this;
        that.getQr();
    },
    onShow: function () {
        //自动加载
        var that = this;
        that.timer = setInterval(() => {
                that.getQr()
    },
        60000
        )
        console.log('onShow')
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
        var that = this;
        clearInterval(that.timer);
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

                        wx.showToast({
                            title: '正在更新',
                            icon: 'loading',
                            duration: 3000
                        });

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

});
