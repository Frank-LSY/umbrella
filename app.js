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
  
    /*调用登录接口*/
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求  
            console.log(res.code)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      }); 
    Dynamic.setCurrentStatus(Static.Statuses.Unusing);
    check.checkRegister();  //检查注册
    check.checkMoney();     //检查账户
    check.getMarkers();
  }
})

