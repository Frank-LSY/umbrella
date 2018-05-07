var app = getApp();

//存放时刻需要检查的调用
var router = require("../router.js");
//判断当前网络
wx.getNetworkType({
  success: function (res) {
    // console.log(res);
    if (res.networkType === "none" || res.networkType === "unknow")
      wx.showModal({
        title: "您当前的网络状况不稳定，请检查网络连接后重试！",
      })
  }
});
//请求我的钱包，余额
wx.request({
  url: router.user.my_wallet,
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  success: function (res) {
    wx.setStorageSync("balance", 5);
    wx.setStorageSync("redbag", 5);
    wx.setStorageSync("needmoney", 5);
    console.log(res);
  }, fail: function (res) {
    console.log(res);
    wx.setStorageSync("balance", 5);
    wx.setStorageSync("redbag", 5);
    wx.setStorageSync("needmoney", 5);
  }, complete: function (res) {
    wx.setStorageSync("balance", 5);
    wx.setStorageSync("redbag", 5);
    wx.setStorageSync("needmoney", 5);
  }
});

//请求我的押金
wx.request({
  url: router.user.query_deposit,
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  success: function (res) {
    wx.setStorageSync("needmoney", 35);
    // console.log(res);
  }, fail: function (res) {
    wx.setStorageSync("needmoney", 35);
    // console.log(res);
  }, complete: function (res) {
    wx.setStorageSync("needmoney", 35);
  }
})
