//配置文件
var config = require('./router.js');
var init=require('./systemcall/init.js');
var check=require('./systemcall/check.js')
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
    userInfo: null,
    LoginStatus: false,
    Balance: 1,
    CashPledge: 0,
    using: false,
  },
  onLaunch: function () {
  }
})

