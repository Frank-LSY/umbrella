var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var itemWidht = 220;
var config = require('../../../config');
var timer;
Page({
    data: {
        //接口
        loadText1: '',
        loadText2: "",
        containerHeight1: '',
        containerHeight2: '',
        row1: 0,
        row2: 0,
        // tab切换
        currentTab: 0,
        tabs: ["借伞记录", "还伞记录"],
        activeIndex: 1,
        sliderOffset: 0,
        sliderLeft: 0,
        borrow_record: [{}],
        back_record: [{}],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        sliderWidth: 0
    },
    onLoad: function () {
        var that = this;
        console.log('onLoad')
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                    sliderWidth: res.windowWidth / that.data.tabs.length
                });
            }
        });


        /********返回用户信息*******/
        wx.request({
            url: config.auntie.use_record,
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // console.log(res.data)
                var statu1 = res.data.re_code1;
                var statu2 = res.data.re_code2;
                console.log('11111111111111')
                console.log(res)

                if (statu1 == 200) {
                    if (res.data.borrow_record.length > 4) {
                        that.setData({
                            loadText1: "加载更多",
                            borrow_record: res.data.borrow_record.splice(that.data.row1, that.data.row1 + 4),
                            row1: that.data.row1 + 4,
                            containerHeight1: itemWidht * (that.data.row1 + 4) + 120
                        })
                        console.log(that.data.borrow_record)
                    } else {
                        that.setData({
                            loadText1: "没有更多数据了",
                            hideFlag1: true,
                            borrow_record: res.data.borrow_record,
                            row1: res.data.borrow_record.length,
                            containerHeight1: itemWidht * res.data.borrow_record.length + 120
                        });
                        console.log(that.data.borrow_record)
                    }
                } else if (statu1 == 400) {
                    that.setData({
                        borrow_record: [],
                        loadText1: '您当前没有借伞记录'
                    });
                }
                if (statu2 == 200) {
                    console.log(that.data.back_record)
                    if (res.data.back_record.length > 4) {
                        that.setData({
                            loadText2: "加载更多",
                            back_record: res.data.back_record.splice(that.data.row2, that.data.row2 + 4),
                            row2: that.data.row2 + 4,
                            containerHeight2: itemWidht * (that.data.row2 + 4) + 120
                        })
                    }
                    else {
                        that.setData({
                            loadText2: "没有更多数据了",
                            back_record: res.data.back_record,
                            row2: res.data.back_record.length,
                            containerHeight2: itemWidht * res.data.back_record.length + 120
                        });
                    }
                } else if (statu2 == 400) {
                    that.setData({
                        back_record: [],
                        loadText2: '您当前没有还伞记录'
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
    },

    //下拉刷新
    // onPullDownRefresh: function () {
    //   var that = this;
    //   wx.startPullDownRefresh(
    //     wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
    //       title: '加载中',
    //       icon: 'loading',
    //       duration: 1000
    //     }),
    //     that.setLoading2()
    //   )
    // },

    //阿姨还伞确认
    checkU: function (e) {
        var that = this
        console.log("sadaada");
        console.log(e);
        wx.request({
            url: config.auntie.check_umbrella,
            data: {'backrecord': e.currentTarget.dataset.backrecord},
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var statu = res.data.re_code2
                console.log(res.data);
                //已完成订单
                if (statu == 200) {
                    if (res.data.back_record.length > that.data.row2) {
                        that.setData({
                            back_record: res.data.back_record.slice(0, that.data.row2 + 1),
                            containerHeight2: itemWidht * (that.data.row2 + 4) + 120,
                            loadText2: "加载更多"
                        });
                    } else {
                        that.setData({
                            loadText2: "没有更多数据了"

                        });
                    }
                    wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
                        title: '成功',
                        icon: 'success',
                        duration: 1000
                    })
                }
            },
            fail: function () {
                // fail
            },
        })
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    //加载借伞记录
    setLoading1: function (e) {
        var that = this
        wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
            title: '加载中',
            icon: 'loading',
            duration: 200
        })
        wx.request({
            url: config.auntie.use_record,
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
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
                }
                else {
                    that.setData({
                        loadText1: "没有更多数据了"
                    });
                }
                // }

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
    //加载还伞记录
    setLoading2: function (e) {
        var that = this
        wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
            title: '加载中',
            icon: 'loading',
            duration: 200
        })
        wx.request({
            url: config.auntie.use_record,
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var statu = res.data.re_code2
                console.log(res.data);
                //
                if (res.data.back_record.length > that.data.row2) {
                    that.setData({
                        row2: that.data.row2 + 4,
                        back_record: res.data.back_record.slice(0, that.data.row2 + 4),
                        containerHeight2: itemWidht * (that.data.row2 + 4) + 120,
                        loadText2: "加载更多"

                    });
                }
                else {
                    that.setData({
                        loadText2: "没有更多数据了"
                    });
                }
            },
            fail: function () {
                // fail
                that.failMessage()
            },

        })

    },

    onShow: function () {
        //自动加载
        var that = this;
        this.timer = setInterval(() => {
                that.setLoading2()
    },
        30000
        )
        console.log('onShow')
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
        clearInterval(this.timer);
        console.log('onHide')
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
        clearInterval(this.timer);
        console.log('onUnload')
    }

});
