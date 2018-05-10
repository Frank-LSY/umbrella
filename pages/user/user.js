// pages/newpage/user/user.js
const Dynamic=require("../../systemcall/Storage.js")
var app=getApp();

Page({
  onLaunch: function () {
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
  } ,
    getPhoneNumber: function (e) { 
      console.log(e.detail.errMsg)
      console.log(e.detail.iv)
      console.log(e.detail.encryptedData)
    } ,
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}  
  },
  // 点击页面的view进入详情页
  detail:function(event){
    console.log(event.currentTarget.dataset);
    wx.navigateTo({
      url: event.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    //调用应用实例的方法获取全局数据
    this.setData({
      userInfo:Dynamic.getUserInfo()
    })
  },
})