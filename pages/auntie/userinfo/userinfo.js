var config = require('../../../config');
Page({
    data: {
        age: '',
        id_card: '',
        true_name: '',
        organization: '',
        sex: '',
        head: '',
        //接口

    },
    onLoad: function () {
        var that = this;
        console.log(that)

        /********yh_start_返回用户信息*******/
        wx.request({
            url: config.auntie.admin_info,
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
                var user = res.data.user
                var age = user.age,
                    id_card = user.id_card,
                    true_name = user.true_name,
                    organization = user.organization,
                    sex = user.sex,
                    head = user.head;
                // var age id_card true_name organization sex head
                if (statu == 200) {
                    that.setData({
                        'age': age,
                        'id_card': id_card,
                        'true_name': true_name,
                        'organization': organization,
                        'sex': sex,
                        'head': head
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
});
