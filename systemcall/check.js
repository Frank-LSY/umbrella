var app = getApp();
//全局数据
var all=require('../data/all.js')
//存放时刻需要检查的调用
var router = require("../router.js");

//模拟随机时间
function simulate () {
  return Math.random() < 0.5 ? true : false;
}
module.exports={
  
  //检查是否注册
  checkregister:function(user) {
    console.log("checkuser")
    wx.request({
      url: router.user.checkuser,
      method: 'post',
      data: user,
      success: function (res) {
      }, fail: function (res) {
      }, complete: function (res) {
        app.globalData.CurrentStatus = simulate() ? all.Statuses.Registered : all.Statuses.Unregister
      }
    });
  },


  //判断当前网络
  checknet:function() {
    console.log("checknet")
    wx.getNetworkType({
      success: function (res) {
        // console.log(res);
        if (res.networkType === "none" || res.networkType === "unknow")
          wx.showModal({
            title: "您当前的网络状况不稳定，请检查网络连接后重试！",
          })
      }
    });
  },

  //请求我的账户，包括余额，已领红包，待领红包，押金
  checkmoney:function() {
    wx.request({
      url: router.user.my_account,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
      }, fail: function (res) {
      }, complete: function (res) {
        wx.setStorageSync("hadredbag", 10);
        wx.setStorageSync("redbag", 5);
        wx.setStorageSync("needmoney", 30);
        console.log("checkmoney");
      }
    });
  }
}

