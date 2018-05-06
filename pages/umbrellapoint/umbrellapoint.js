// pages/umbrella/umbrella.js

var router=require('../../router.js')

var that=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    umbrellapoint: []
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
  }
})