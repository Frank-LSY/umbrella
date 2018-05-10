// pages/newpage/myredbag/myredbag.js
//动态数据
const Dynamic=require("../../systemcall/Storage.js");

const Toptips = require('../../dist/toptips/index');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    hadredbag: "0",
    redbag: 0,
    duration: 2000,
  },
  
  onLoad: function (options) {
    console.log(options);
    console.log(this.data.hadredbag);
    this.setData({
      hadredbag:Dynamic.getHadRedBag()
    })
    if (Dynamic.getRedBag() !== 0) {
      //正在领取红包
      this.setData({
        hadredbag: this.data.hadredbag + "+" + Dynamic.getRedBag(),
        redbag: Dynamic.getRedBag()
      });
      //红包领取完成
      setTimeout(() => {
        this.setData({
          hadredbag: this.data.redbag + parseFloat(this.data.hadredbag),
          redbag: 0
        })
        Dynamic.setHadRedBag(Dynamic.getHadRedBag()+Dynamic.getRedBag()); 
        Dynamic.setRedBag(0);
      }, this.data.duration);
    }
  }
})