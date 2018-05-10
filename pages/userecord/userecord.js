// pages/newpage/userecord/userecord.js
//动态数据
const Dynamic = require("../../systemcall/Storage.js");
//静态数据
const Static = require("../../systemcall/Static.js");
//请求地址
var router = require('../../router.js');
var that = null;
Page({
  data: {
    records: null,
    using: false
  },
  onLoad: function () {
    that = this;
    if (Dynamic.getCurrentStatus === Static.Statuses.Using) {
      that.setData({ using: true });
    }
    this.getRecords();
  },
  getRecords: function () {
    wx.request({
      url: router.user.get_useRecord,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        that.setData({
          records: [{
            backposition:"七号楼",
            borrowposition: '八号楼',
            borrowtime: "2018-05-03 19:22",
            backtime:"2018-05-03 19:22",
            usedtime: '90分钟'
          }, {
            backposition: "七号楼",
            borrowposition: '八号楼',
            borrowtime: "2018-05-03 19:22",
            backtime: "2018-05-03 19:22",
            usedtime: '90分钟'
          }]
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
});