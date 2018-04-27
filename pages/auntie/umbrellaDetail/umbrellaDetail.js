var config = require('../../../config');
Page({
    data: {
        //接口
        umbrellaLocation: "",
        umbrellaNum: ""
    },
    onLoad: function () {
        var that = this;
        /********返回用户信息*******/
        wx.request({
            url: config.auntie.station_info,
            data: {},
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var statu = res.data.code;
                var ulocation = res.data.data.location;
                var unumber = res.data.data.number;
                if (statu == 200) {
                    if (ulocation == null) {
                        ulocation = "无";
                    }
                    if (unumber == null) {
                        unumber = 0;
                    }
                    that.setData({
                        umbrellaLocation: ulocation,
                        umbrellaNum: unumber,
                    });
                }
            },
            fail: function () {
                // fail
                // that.failMessage()
            },
            complete: function () {
                // complete
            }
        })
    },
});

