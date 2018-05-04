// pages/newpage/userecord/userecord.js
var router=require('../../router.js');
var that=null;
Page({
  data: {
    records:null
  },
    onLoad: function () {
      that=this;
      wx.request({
        url: router.user.get_useRecord,
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log(res);
          that.setData({
            records:[{
              position: '八号楼',
              borrowtime: "2018-05-03:19:22",
              usedtime: '90分钟'
            }]
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } 
});