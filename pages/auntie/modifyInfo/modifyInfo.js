var config = require('..//../../config');
Page({
    data: {
        files: [],
        age: '',
        id_card: '',
        true_name: '',
        organization: '',
        sex: '',
        head: '',
        //接口
        radioItems: [
            {name: '女', value: '0', checked: true},
            {name: '男', value: '1', checked: false}
        ],
    },
    onLoad: function () {
        var that = this;
        console.log(that)
        /********yh_start_返回用户信息*******/
        wx.request({
            url: config.auntie.edit_userInfo,
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var content = res.data.data
                var statu = res.data.re_code
                var user = res.data.edit_list
                console.log(user)
                var age = user.age,
                    id_card = user.id_card,
                    true_name = user.true_name,
                    organization = user.organization,
                    sex = user.sex,
                    head = user.head;
                console.log(sex)
                if (statu == 200) {
                    that.setData({
                        'age': age,
                        'id_card': id_card,
                        'true_name': true_name,
                        'organization': organization,
                        'sex': sex,
                        'head': head,
                    });
                    if (sex == 1) {
                        that.setData({
                            'radioItems[0].checked': false,
                            'radioItems[1].checked': true,
                        });
                    }
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
        var that = this;
        console.log(typeof(e.detail.value.truename))
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
                url: config.auntie.upload_userInfo,
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
                    console.log(that.data.sex)
                    var data = JSON.parse(res.data) //需要手工转换

                    console.log(res)
                    console.log(data.data)
                    if (data.re_code == 200) {
                        wx.uploadFile({ //再次上传
                            url: config.auntie.upload_userInfo,
                            filePath: that.data.files[1],
                            name: 'img_file',
                            formData: {"id": data.data.id},
                            success: function (res) {
                                var data = res.data;
                                console.log(res);
                                console.log(res.statusCode)
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
                    } else {
                        wx.showToast({
                            title: data.code_info,
                            icon: 'error',
                            duration: 4000
                        });
                    }

                },
                fail: function () {
                    console.log("error2");
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
});
