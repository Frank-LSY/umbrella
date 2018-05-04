// pages/umbrella/umbrella.js

var router=require('../../router.js')

var that=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    umbrellapoint: [{ point: "华中师范大学九号楼", number: 10 }, { point: "华中师范大学九号楼", number: 10 }, { point: "华中师范大学九号楼", number: 10 }, { point: "华中师范大学九号楼", number: 10 }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    wx.request({
      url: router.user.station_info,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          umbrellapoint:res.data.data
        })
      }, fail: function (res) {
        console.log(res);
      }
    });
  },
  toSponsor: function (e) {
    console.log(e);
    wx.redirectTo({
      url: '../sponsor/sponsor?sponsor_id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})