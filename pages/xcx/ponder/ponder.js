var config = require('../../../config');
Page({
    data: {
        files: [],
        age: '',
        id_card: '',
        true_name: '',
        organization: '',
        id: '',
        sex: '',
        head: '',
        radioItems: [
            {name: '男', value: '1'},
            {name: '女', value: '0', checked: true}
        ],

        objectArray: [],
        multiIndex: [0, 0],
    },
    onLoad: function () {
        var that = this
        wx.request({
            url: config.user.station_info,
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
                console.log(res.data);
                that.setData({
                    objectArray: content
                })

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
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
                console.log(that.data.files)
            }
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    formSubmit: function (e) {
        console.log(e.detail.value)
        console.log("地址" + config.user.apply_admin)
        var that = this;
        if (e.detail.value.truename == "") {
            wx.showToast({
                title: '姓名不能为空',
                icon: 'loding',
                duration: 3000
            });
        } else if (e.detail.value.age == "") {
            wx.showToast({
                title: '年龄不能为空',
                icon: 'loding',
                duration: 3000
            });
        } else if (e.detail.value.organization == "") {
            wx.showToast({
                title: '工作单位不能为空',
                icon: 'loding',
                duration: 3000
            });
        } else if (e.detail.value.IDcard == "") {
            wx.showToast({
                title: '身份证号不能为空',
                icon: 'loding',
                duration: 3000
            });
        } else if (that.data.files.length < 2) {
            wx.showToast({
                title: '请上传身份证照片',
                icon: 'loding',
                duration: 3000
            });
        } else {

            wx.uploadFile({
                url: config.user.apply_admin,
                filePath: that.data.files[0],
                name: 'img_file',
                formData: {
                    'true_name': e.detail.value.truename,
                    'sex': that.data.sex,
                    'age': e.detail.value.age,
                    'organization': e.detail.value.organization,
                    'id_card': e.detail.value.IDcard,
                },
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    console.log(res.data)
                    console.log(typeof res.data)
                    var data = JSON.parse(res.data) //需要手工转换
                    console.log(data)
                    wx.uploadFile({ //再次上传
                        url: config.user.apply_admin,
                        filePath: that.data.files[1],
                        name: 'img_file',
                        formData: {"id": data.data.id},
                        success: function (res) {

                            var data = JSON.parse(res.data) //需要手工转换
                            console.log(data)
                            if (res.statusCode == 200) {
                                wx.showToast({
                                    title: '申请提交成功！',
                                    icon: 'success',
                                    duration: 3000
                                });
                                setTimeout(function () {
                                    wx.reLaunch({
                                        url: '../index/index'
                                    })
                                }, 3000)
                            }
                        },
                        fail: function () {
                            console.log("error1");
                        }
                    })

                },
                fail: function (res) {
                    console.log(res);
                }
            })
        }
    },

    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        console.log(radioItems)
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems,
            sex: e.detail.value
        });
        // console.log(e.detail.value)
        // console.log(this.data.sex)
    },

    bindMultiPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            multiIndex: e.detail.value
        })
    },
});
