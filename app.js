//获取初始化的数据（用户，用伞情况）
var check = require('./systemcall/check.js');
//动态数据
var Dynamic=require("./systemcall/Storage.js");
//静态数据
const Static=require("./systemcall/Static.js");
var that;
App({
  globalData: {
  },

  onLaunch: function () {
    that = this,
    wx.getUserInfo({
      success: function (res) {
        Dynamic.setUserInfo(res.userInfo);
      }
    }),
    Dynamic.setCurrentStatus(Static.Statuses.Unusing)
  }
})

