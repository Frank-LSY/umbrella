var modalFlag;
var config = require('../../../config');
Page({
    data: {
        rechargeType: 2, //充押金
        rechargeNum: 30,//默认押金

        deposit: 0, //用户自己钱包里的押金额度，后面会从后台查询
        modalFlag: true,
        currentMoney: 30,
        moneyArr: [],
        //记录上一次点击的充值选项的id
        lastMoney: 30
    },

    getMoneyArr: function (arr, checkID) {
        var moneyArr = [];
        var that = this;
        var i = 0;
        for (; i < arr.length; i++) {

            var style;
            if (arr[i] == checkID) {
                style = that.getCheckedBtnStyle();
            }
            else {
                style = that.getUncheckedBtnStyle();
            }
            if (i % 2 == 0) {
                moneyArr.push([]);
            }
            moneyArr[parseInt(i / 2)].push({
                isMoney: true,
                content: "￥" + arr[i],//button上的钱
                id: arr[i],
                style: style
            });
        }

        if (i % 2 == 1) {
            moneyArr[parseInt(i / 2)].push({
                isMoney: false
            });
        }

        return moneyArr;
    },
    getUncheckedBtnStyle: function () {
        return {
            color: "#000000",
            background: "#FFFFFF",
        };
    },
    getCheckedBtnStyle: function () {
        return {
            color: "#FFFFFF",
            background: "#00a82f",
        };
    },

    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        this.setData({
            'moneyArr': this.getMoneyArr([30, 60, 90, 120], 30)

        });
    },
    endRide: function () {
        this.setData({
            "modalFlag": true
        })
    },
    //充值协议
    chargeAgree: function () {
        console.log("点击充值协议")
        wx.navigateTo({
            url: '../depositPact/depositPact',
        })
    },
    //点击充值选项
    chioceAct: function (res) {
        var that = this
        console.log("点击充值选项")
        console.log(res.currentTarget.dataset.currentid)
        var id = res.currentTarget.dataset.currentid
        that.setData({
            "rechargeNum": id, //修改充值押金
            'lastMoney': id,//点击button后的钱数（id和button上的钱数是一样的）
            'moneyArr': that.getMoneyArr([30, 60, 90, 120], id)
        })

    },

    //点击去充值
    gotoRecharged: function () {
        console.log("去充值按钮")
        var that = this;
        console.log(that.data.rechargeNum)
        //第一个请求，获得支付凭证
        wx.request({
            url: config.user.paymentUrl,
            data: {
                rechargeNum: that.data.rechargeNum, //充值金额
                rechargeType: 2 //充值类型
            },
            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                /***第二个请求，开始支付***/
                wx.requestPayment({
                    //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
                    timeStamp: res.data.timeStamp,
                    //随机字符串，长度为32个字符以下。
                    nonceStr: res.data.nonceStr,
                    //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
                    package: res.data.package,
                    //签名算法，暂支持 MD5
                    signType: 'MD5',
                    //签名
                    paySign: res.data.paySign,
                    //支付成功，开始更新用户余额
                    success: function (res) {
                        //第三个请求，更新用户信息
                        wx.request({
                            url: config.user.charge_deposit,
                            data: {
                                "deposit": that.data.rechargeNum, //充值金额
                            },
                            method: 'POST',
                            header: {
                                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                                that.setData({
                                    "deposit": res.data.data.deposit, //从后台获取余
                                    "modalFlag": false
                                })
                            }//endsuccess

                        })//endreqquest
                    },
                    fail: function (res) {

                    },
                    complete: function (res) {


                    }
                })
            }
        })
    },

})
