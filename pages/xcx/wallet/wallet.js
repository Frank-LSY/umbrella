var md5 = require("../../../utils/MD5.js")
var modalFlag = true;
var config = require('../../../config');
Page({
    data: {
        rechargeType: 1, //充余额
        rechargeTime: 0, //充值时间

        nocancel: false,
        modalFlag: modalFlag,
        wallet: 0, //余额，后面从后台查询
        deposit: 0, //用户自己钱包里的押金额度，后面会从后台查询
        depositTitle: "充押金",
        disabled: true,
        //0表示充,1表示退
        id: 0,
        //查询余额接口
        queryWalletUrl: "",
        //校验码
        SALT: "AIRBIKESALT",
        currentMoney: 5,
        rechargeNum: 5, //充值金额
        orderNum: '', //商品订单号
        moneyArr: [],
        //记录上一次点击的充值选项的id
        lastMoneyId: 0
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

        /*********yh_start********/
            //查询押金
        var that = this
        this.setData({
            'moneyArr': that.getMoneyArr([5, 10, 15, 20, 25, 30], 5)

        });
        wx.request({
            url: config.user.my_wallet,
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // 设置请求的 header
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                // success
                var content = res.data.data
                var message = res.data.code_info
                var statu = res.data.re_code
                //查询成功,弹框没必要
                // wx.showToast({
                //       title: message,
                //       icon: 'success',
                //       duration: 2000,
                //   })
                if (statu == 200) { //查询成功
                    that.setData({
                        "wallet": content.over, //从后台获取余额
                        "deposit": content.deposit //从后台获取押金
                    })

                    if (content.deposit > 0) {
                        that.setData({
                            "id": 1,
                            "depositTitle": "   如何退押金",
                            "disabled": false
                        })
                    }
                    // 自己加的
                    else {
                        that.setData({
                            "id": 0,
                            "depositTitle": "   充押金",
                            "disabled": false
                        })
                    }
                }
                //检查是否登录失效
                else if (statu == 400) {
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
    confirm: function () {

        wx.navigateTo({
            url: '../wallet/wallet',
        })

    },
    //交易明细
    transactionDetails: function () {
        wx.navigateTo({
            url: '../translationDetail/translationDetail',
        })
    },

    //充值协议
    chargeAgree: function () {
        console.log("点击充值协议")
        wx.navigateTo({
            url: '../walletPact/walletPact',
        })
    },
    //点击充值选项
    chioceAct: function (res) {
        var that = this
        console.log("点击充值选项")
        console.log(res.currentTarget.dataset.currentid);
        var id = res.currentTarget.dataset.currentid;
        console.log(id)
        that.setData({
            "rechargeNum": id,//修改充值余额
            "lastMoney": id,//点击button后的钱数（id和button上的钱数是一样的）
            'moneyArr': that.getMoneyArr([5, 10, 15, 20, 25, 30], id)
        })

    },

    endRide: function () {
        modalFlag = true
        this.setData({
            modalFlag: modalFlag
        })

    },
    //点击去充值
    gotoRecharged: function () {
        console.log("去充值按钮")
        var that = this;

        wx.request({ //发起网络请求
            url: config.user.paymentUrl,
            data: {
                rechargeNum: that.data.rechargeNum, //充值金额
                rechargeType: 1 //充值类型
            },

            method: 'POST',
            header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

                /***开始支付请求***/
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

                        wx.request({
                            url: config.user.charge_over,
                            data: {
                                "over": that.data.rechargeNum, //充值金额
                            },
                            method: 'POST',
                            header: {
                                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                                that.setData({
                                    "wallet": res.data.data.over, //从后台获取余
                                    "modalFlag": false
                                })
                            }//endsuccess

                        })//endreqquest

                    },
                    fail: function (res) {


                    },
                    complete: function (res) {

                        // wx.request({
                        //   url: config.user.charge_over,
                        //   data: {
                        //     "over": 5, //充值金额
                        //   },
                        //   method: 'POST',
                        //   header: {
                        //     'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                        //     'content-type': 'application/x-www-form-urlencoded'
                        //   },
                        //   success: function (res) {
                        //     that.setData({
                        //       "wallet": res.data.data.over, //从后台获取余
                        //       "modalFlag": false
                        //     })
                        //   }//endsuccess

                        // })//endreqquest
                    }
                })
            }
        })
    },

    //充押金
    chargeDeposit: function () {
        // var that = this
        // if (that.data.id == 0) {

        //充押金
        wx.redirectTo({
            url: '../deposit/deposit'
        })
    },
    //退押金
    returnDeposit: function () {
        var that = this
        if (that.data.deposit > 0) {
            wx.redirectTo({
                url: '../returnDeposit/returnDeposit'
            })
        } else {
            wx.showToast({
                title: '暂无押金可退',
                icon: 'loading',
                duration: 2000,
            })
        }


    }

    //充值
    // recharge: function() {
    //   wx.navigateTo({
    //     url: '../deposit/deposit'
    //   })
    // }

})
