var config = require('../../../config');
Page({
    data: {

        wageDetail: []
    },
    onLoad: function () {
        var that = this;

        wx.request({
            url: config.auntie.wage_record,
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
                        wageDetail: res.data.data
                    })
                    // console.log(res.data.data)
                } else {
                    //查询失败
                }
            },
            fail: function () {
                // fail
            },
        });
    }
});
