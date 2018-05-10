const router = require("../router.js");

module.exports = {
  addmoney: function (money) {
    wx.request({
      url: router.user.paymentUrl,
      data: {
        rechargeNum: money, //充值金额
        rechargeType: 1 //充值类型
      },
      method: 'POST',
      header: {
        'authenticate': wx.getStorageSync('client_sign'), //唯一标识
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
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
              url: router.user.charge_deposit,
              data: {
                "deposit": money, //充值金额
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
  // 得到当前时间
  formatTime: function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
} 
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}