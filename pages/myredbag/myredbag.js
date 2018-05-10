// pages/newpage/myredbag/myredbag.js
const Toptips = require('../../dist/toptips/index');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    hadredbag: "0",
    redbag: 0,
    duration: 2000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log(this.data.hadredbag);
    this.setData({
      hadredbag:wx.getStorageSync("hadredbag")
    })
    if (wx.getStorageSync("redbag") !== 0) {
      //正在领取红包
      this.setData({
        hadredbag: this.data.hadredbag + "+" + options.redbag,
        redbag: wx.getStorageSync("redbag")
      });
      //红包领取完成
      setTimeout(() => {
        this.setData({
          hadredbag: this.data.redbag + parseFloat(this.data.hadredbag),
          redbag: 0
        })
        wx.setStorageSync("hadredbag", wx.getStorageSync("redbag") +wx.getStorageSync("hadredbag")) //已领红包增加
        wx.setStorageSync("redbag", 0); //待领红包为0 
      }, this.data.duration);
    }
  }
})