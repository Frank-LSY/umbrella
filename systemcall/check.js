//动态数据
const Dynamic = require("./Storage.js");
// 静态数据
const Static=require("./Static.js");
//存放时刻需要检查的调用
var router = require("../router.js");

//模拟随机时间
function simulate () {
  return Math.random() < 0.5 ? true : false;
}
module.exports={
  //得到伞点
  getMarkers:function(){
    wx.request({
      url: router.user.get_station_location,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.setStorageSync("umbrellapoint", res.data.data.markers);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //检查是否注册
  checkRegister:function(user) {
    wx.getSetting({        //检查用户是否登录
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              Dynamic.setCurrentStatus(Static.Statuses.Register)
            }
          })
        }
        else {
          Dynamic.setCurrentStatus(Static.Statuses.Unregister)
        }
      }
    })
    console.log("checkuser")
    wx.request({
      url: router.user.checkuser,
      method: 'post',
      data: user,
      success: function (res) {
      }, fail: function (res) {
      }, complete: function (res) {
        Dynamic.setCurrentStatus(simulate() ? Static.Statuses.Registered : Static.Statuses.Unregister)
      }
    });
  },


  //判断当前网络
  checkNet:function() {
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
  checkMoney:function() {
    wx.request({
      url: router.user.my_account,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
      }, fail: function (res) {
      }, complete: function (res) {
        Dynamic.setHadRedBag(10);
        Dynamic.setRedBag(5);
        Dynamic.setNeedMoney(30);
        console.log("checkmoney");
      }
    });
  }
}

