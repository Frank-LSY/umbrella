//发送请求的地址
var config = require('./router.js');
//获取初始化的数据（用户，用伞情况）
var init=require('./systemcall/init.js');
//检查网络等状态
var check=require('./systemcall/check.js');

var all=require('./data/all.js');

App({
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口  
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData: {
    userInfo: null, //用户数据
    CurrentStatus: all.Statuses.Unlogin, //登录状态
    Balance: 1, //余额
    CashPledge: 0,  //押金
    using: false, //是否有伞正在使用
  },
  onLaunch: function () {
  }
})

