var modalFlag = true;
var moneyArr = [];
var config = require('../../../config');
Page({
    data: {

        maxDeposit: 0,
        modalFlag: modalFlag,
        lastMoney: 0,
        moneyArr: [],
        varietyMoneyHight: '',//
        //记录上一次点击的充值选项的id
        lastMoneyId: 0

    },
    getMoneyArr: function (maxDeposit) {
        var that = this
        var MoneyArr = [];

        for (var i = 0; i < maxDeposit / 30; i++) {
            var ele = {
                content: "￥" + String(maxDeposit - 30 * i),
                color: "#000000",
                background: "#FFFFFF",
                id: maxDeposit - 30 * i,
            };
            ele.top = String(150 + parseInt(i / 2) * 120) + "rpx";
            if (i % 2 == 0) {
                ele.left = "40rpx";

            }
            else {
                ele.left = "395rpx";
            }

            MoneyArr.push(ele);
        }
        console.log(MoneyArr[MoneyArr.length - 1].top)
        that.setData({
            "varietyMoneyHight": MoneyArr[MoneyArr.length - 1].top
        })
        return MoneyArr
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载

        var that = this
        wx.request({
            url: config.user.query_deposit,
            data: {},
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },

            success: function (res) {
                // success
                var content = res.data.data
                console.log(content.able_refund_deposit)
                console.log(content.able_refund_deposit / 40)
                console.log(Math.ceil(content.able_refund_deposit / 40))
                var message = res.data.code_info
                var statu = res.data.re_code

                if (statu == 200) {//查询成功

                    that.setData({
                        "maxDeposit": content.able_refund_deposit,//从后台获取押金
                        // "currentMoney":that.data.maxDeposit,
                        "moneyArr": that.getMoneyArr(content.able_refund_deposit),
                        "contentLenMax": Math.ceil(content.able_refund_deposit / 40) * 80
                    })

                }
                else if (statu == 500) {//没有押金可退
                    that.setData({
                        "maxDeposit": 0//从后台获取押金
                    })
                }
                else if (statu == 400) { //检查是否登录失效
                    disabledToken.reLogin(-2)
                }
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
        /*********yh_end********/

    },
    endRide: function () {
        modalFlag = true
        this.setData({
            modalFlag: modalFlag
        })
        var that = this
        if (that.data.maxDeposit == 0) {
            wx.navigateBack({
                delta: 1
            })
        }
    },
    //点击押金按钮
    chioceAct: function (res) {
        var that = this
        console.log("点击退押金选项")
        console.log(res.currentTarget.dataset.currentid)
        var id = res.currentTarget.dataset.currentid
        that.setData({
            lastMoney: id,//点击button后的钱数（id和button上的钱数是一样的）
        });
        console.log(that.data.moneyArr.length - parseInt(id / 30))
        var index = that.data.moneyArr.length - parseInt(id / 30)
        console.log(index)

        var param = {};
        for (var i = 0; i < that.data.moneyArr.length; i++) {
            var nnn = "moneyArr[" + i + "].background"
            var xxx = "moneyArr[" + i + "].color"
            if (i == index) {
                param[nnn] = '#00a82f';
                param[xxx] = '#FFFFFF';
                that.setData(param);
            }
            else {
                param[nnn] = '#FFFFFF';
                param[xxx] = '#000000';
                that.setData(param);
            }
        }
    },
    translation: function () {
        wx.navigateTo({
            url: '../translationDetail/translationDetail',
        })
    },
    //点击退押金
    gotoReturn: function () {
        var that = this
        console.log("退押金按钮")
        if (that.data.lastMoney == 0) {
            wx.showToast({
                title: '请选择金额!',
                icon: 'loading',
                duration: 2000,
            })
        } else {

            wx.request({
                url: config.user.refund_deposit,
                data: {
                    'deposit': that.data.lastMoney, //这里替换成实际退款金额
                },
                method: 'POST',
                header: {
                    'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    // success
                    var content = res.data.data
                    var message = res.data.code_info
                    var statu = res.data.re_code
                    if (statu == 200) {//退款提交成功
                        that.setData({
                            "maxDeposit": content.able_refund_deposit,//从后台获取余额
                            "moneyArr": that.getMoneyArr(content.able_refund_deposit),
                            "lastMoney": 0,
                            modalFlag: false
                        })

                    } else if (statu == 500) {//没有押金可退
                        that.setData({
                            "maxDeposit": content.able_refund_deposit,//从后台获取余额
                            "moneyArr": [],
                            "lastMoney": 0,
                            modalFlag: false
                        })
                    }
                    //检查是否登录失效
                    else if (statu == 400) {
                        disabledToken.reLogin(-2)
                    }
                },
                fail: function () {
                    // fail
                },
            });
        }
    },

})