// pages/newpage/mywallet/mywallet.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Balance: 0, //余额
    redbag:0 //红包
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        Balance:wx.getStorageSync("balance"),
        Redbag:wx.getStorageSync("redbag")
      })
  },
  
})