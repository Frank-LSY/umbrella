var config = require('../../../config');
Page({
  data: {
    sponsor: [],//赞助商
    activity: [],//活动
    ac_imag: ""

  },
  onLoad: function (e) {
    var that = this;
    /********yh_start_返回用户信息*******/
    wx.request({
      url: config.user.sponsor,  //需要修改为红包服务wl
      data: { 'sponsor': e.sponsor_id },
      method: 'POST',
      header: {
        'authenticate': wx.getStorageSync('client_sign'), //唯一标识
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var content = res.data.data;
        var statu = res.data.re_code

        if (statu == 200) {
          that.setData({
            sponsor: content.sponsor,
            activity: content.activity,
            ac_imag: config.uploads + "/" + content.activity.image,
            sp_logo: config.uploads + "/" + content.sponsor.logo

          })
          wx.setNavigationBarTitle({
            title: content.sponsor.name//页面标题为路由参数
          })
        } else if (statu == 400) {//赞助商错误
          console.log(res.data.code_info);
        }
      },
      fail: function () {
        // fail
        that.failMessage()
      },
      complete: function () {
        // complete
      }
    })
  },

})
