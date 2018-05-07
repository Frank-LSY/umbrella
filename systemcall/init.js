//检查网络状态
var router=require("../router.js")

//得到站点信息,存入 umbrellapoint
wx.request({
  url: router.user.get_station_location,
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  success: function(res) {
    // console.log(res.data.data.markers);
    wx.setStorageSync("umbrellapoint", res.data.data.markers);
  },
  fail: function(res) {},
  complete: function(res) {},
})
