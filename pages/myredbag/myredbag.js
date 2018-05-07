// pages/newpage/myredbag/myredbag.js
const Toptips = require('../../dist/toptips/index');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    hadredbag: "0",
    redbag: null,
    duration: 2000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log(this.data.hadredbag);
    //红正在领取红包
    this.setData({
      hadredbag: this.data.hadredbag + "+" + options.redbag,
      redbag: parseFloat(options.redbag)
    });
    //红包领取完成
    setTimeout(() => {
      this.setData({
        hadredbag: this.data.redbag + parseFloat(this.data.hadredbag),
        redbag: 0
      })
    }, this.data.duration);
  }
})