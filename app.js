//发送请求的地址
var config = require('./router.js');
//获取初始化的数据（用户，用伞情况）
var init=require('./systemcall/init.js');
//检查网络等状态
var check=require('./systemcall/check.js');
var router = require('./router.js')
var all=require('./data/all.js');
var that;
App({
  getUserInfo: function (cb) {
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
    CurrentStatus: all.Statuses.Unregister, //登录状态,初始为未登录
    Balance: 0, //余额
    CashPledge: 0,  //押金
    using: false, //是否有伞正在使用
    phonenumber:12345678911,

  },

  // 假设已经注册
  onLaunch: function () {
    that = this;
    wx.request({
      url: router.user.registerUrl,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log("register");
        console.log(res);
      }, fail: function (res) {
        console.log(res);
      }, complete(res) {
        that.globalData.CurrentStatus = all.Statuses.Registered;
      }
    })
  },
})

