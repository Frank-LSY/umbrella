//存放时刻需要检查的调用

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