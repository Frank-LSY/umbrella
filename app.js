//获取初始化的数据（用户，用伞情况）
var check = require('./systemcall/check.js');
//存储
var storage=require("./systemcall/Storage.js");

var that;
App({
  globalData: {
  },

  onLaunch: function () {
    that = this,
    wx.getUserInfo({
      success: function (res) {
          storage.setUserInfo(res.userInfo);
      }
    })
  }
})

