//存放时刻需要检查的调用
var router=require("../router.js");
//判断当前网络

wx.getNetworkType({
  success: function (res) {
    console.log(res);
    if (res.networkType === "none" || res.networkType === "unknow")
      wx.showModal({
        title: "您当前的网络状况不稳定，请检查网络连接后重试！",
      })
  }
});

wx.request({
  url: router.user.my_wallet,
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  success:function(res){
    console.log(res);
    wx.setStorageSync("needmoney", 5);
  },fail:function(res){
    console.log(res);
  }
});


wx.request({
  url: router.user.query_deposit,
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  success: function (res) {
    console.log(res);
    wx.setStorageSync("needmoney", 30);
  }, fail: function (res) {
    console.log(res);
  }
})