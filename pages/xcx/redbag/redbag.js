var config = require('../../../config');
Page({
    data: {
        redbagNum: 0, //红包数量
        redbagMoney: 0, //红包余额
        redbagArr: [],
        user: {
            nickname: '未知',
            head: ''
        },
    },
    onLoad: function () {
        var that = this;

        /********yh_start_返回用户信息*******/
        wx.request({
            url: config.user.query_redbag,  //需要修改为红包服务wl
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var content = res.data.data;
                that.setData({
                    redbagArr: content.redbag, //需要修改为后端返回的值wl
                    redbagNum: content.redbag_num,
                    redbagMoney: content.redbag_fee,
                })

                var statu = res.data.re_code
                console.log(res.data);

                if (statu == 200) {
                    that.setData({
                        'user': content,
                        'nickname': content.nickname

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
    //获得红包
    updateRedbag: function (e) {
        var that = this;
        console.log(e)
        wx.request({
            url: config.user.get_redbag,
            data: {'redbag': e.currentTarget.dataset.rb},
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var content = res.data.data;
                var statu = res.data.re_code
                that.setData({
                    redbagArr: content.redbag,
                    redbagNum: content.redbag_num,
                    redbagMoney: content.redbag_fee,
                })
                wx.showToast({
                    title: "领取成功",
                    icon: 'success',
                    duration: 2000,
                })

                console.log(res.data);
            },
            fail: function () {
                // fail
            },

        })
    },


//下拉刷新
    onPullDownRefresh: function () {
        var that = this;
        wx.startPullDownRefresh(
            wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
                title: '加载中',
                icon: 'loading',
                duration: 1000
            }),
            wx.request({
                url: config.auntie.use_record,
                data: {},
                method: 'POST',
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    //还伞记录
                    var statu = res.data.re_code2
                    console.log(res.data);
                    //已完成订单
                    if (res.data.back_record.length > that.data.row2) {
                        that.setData({
                            row2: that.data.row2 + 4,
                            back_record: res.data.back_record.splice(0, that.data.row2 + 4),
                            containerHeight2: itemWidht * (that.data.row2 + 4) + 120,
                            loadText2: "加载更多"
                        });
                    } else {
                        that.setData({
                            loadText2: "没有更多数据了"
                        });
                    }
                    //借伞记录
                    var statu = res.data.re_code1
                    console.log(res.data);
                    //未完成订单
                    if (res.data.borrow_record.length > that.data.row1) {
                        that.setData({
                            loadText1: "数据请求中",
                            row1: that.data.row1 + 4,
                            borrow_record: res.data.borrow_record.splice(0, that.data.row1 + 4),
                            containerHeight1: itemWidht * (that.data.row1 + 4) + 120,
                            loadText1: "加载更多"
                        });
                    } else {
                        that.setData({
                            loadText1: "没有更多数据了"
                        });
                    }
                },
                fail: function () {
                    // fail
                    that.failMessage()
                },
            })
        )
    }
})