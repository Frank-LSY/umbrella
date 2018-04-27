var config = require('../../../config');
Page({
    data: {
        remarks: '伞柄损坏',
        radioItems: [
            {name: '0', value: '伞柄损坏', checked: true},
            {name: '1', value: '面有破损'},
            {name: '2', value: '骨架有折损'},
            {name: '3', value: '其他原因'},
        ],
        true_name: ''
    },
    onLoad: function () {
        var that = this;
        wx.request({
            url: config.auntie.repair_info,             //报修信息（几个意思？怎么和报修站点中提交上来的内容进行一个结合？
            data: {},                                   //估计是其中的某个方法可以直接把数据传递到后端？（那这个函数是哪一个呢？）
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // console.log(res.data)
                var statu = res.data.re_code;
                var content = res.data.data;
                console.log(res)
                console.log(res.data)
                if (statu == 200) {
                    that.setData({
                        true_name: content.user.true_name
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

        this.setData({});
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }
        this.setData({
            radioItems: radioItems,
            remarks: e.detail.value
        });
    },
    formSubmit: function (e) {
        console.log(e.detail.value)
        var that = this;
        if (e.detail.value.number == "") {
            wx.showToast({
                title: "报修数量不能为空",
                icon: 'loading',
                duration: 3000
            });
        } else {


            wx.request({
                url: config.auntie.station_repair,       //这是什么意思来着？是数据传递的地址么~(站点报修？有何用？获取到了什么信息么？)
                method: 'POST',
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    'number': e.detail.value.number,
                    'remarks': that.data.remarks
                },

                success: function (res) {
                    if (res.data.re_code == 200) {

                        setTimeout(function () {
                            wx.switchTab({
                                url: '../index/index'
                            })
                        }, 3000)

                        wx.showToast({
                            title: '报修成功！',
                            icon: 'success',
                            duration: 3000
                        });

                    } else {
                        wx.showToast({
                            title: res.data.code_info,
                            icon: 'loading',
                            duration: 3000
                        });
                    }
                },
                fail: function () { //登录态过期
                    console.log("error");
                }
            })
        }
    }
});
