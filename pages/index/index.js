//zanUI 的包
const Zan = require('../../dist/index');
//数据模块
var Data = require('../../data/index.js');
//全局变量
var all = require('../../data/all.js');
//功能模块，充值钱
var Function = require('../../systemcall/function.js');
var router = require('../../router.js');

var that = null;
var app = getApp();

Page({
  // 页面数据
  data: {
    longitude: null,
    latitude: null,
    markers: Data.markers,    //伞点
    polyline: Data.polyline,    //路线
    controls: Data.controls,    //地图上的控点
    imformation: "您需要充值押金或余额才能借伞！", //提示信息
    needmoney: wx.getStorageSync("needmoney"),  //需要充的钱，控制顶部条
    usedtime: { hour: "00", minute: "15", second: "20" }, //使用中已经使用的时间
    starttime: { hour: "09", minute: "12", second: "20" }  //使用开始的时间
  },
  //初始化
  onLoad: function () {
    that = this;
    this.changeicon();    //查看当前状态改变底部的按钮图片
    if (wx.getStorageSync("redbag") !== 0) {
      this.showDialog();
    }
  },
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map');
    this.getCenterLocation();
    this.moveToLocation();
  },
  // 得到地图中心的位置
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  //中心移动到定位处
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  //移动标记点，后继将用户位置替换为伞的移动
  translateMarker: function () {
    this.mapCtx.translateMarker({
    })
  },

  //点击去充值，充值到能借伞的程度
  addmoney: function () {
    Function.addmoney(wx.getStorageSync("needmoney"));
    that.setData({
      needmoney: 0
    })
  },

  //点击地图上的controls
  click: function (num) {
    switch (num) {
      //点击定位按钮
      case Data.GET_POSITION:
        this.getCenterLocation();
        this.moveToLocation();
        break;
      default:
        break;
    }
  },
  regionchange(e) { console.log(e.type) },
  markertap(e) { console.log(e.markerId) },

  // 对地图的上的controls点击事件绑定
  controltap(e) {
    console.log(e.controlId);
    this.click(e.controlId);

    //是借伞还伞
    if (e.controlId === 4 && app.globalData.CurrentStatus.status !== 0) {
      that.getscan();
    }// 如果不是借伞还伞，跳转
    else if (e.controlId >= 1)
      wx.navigateTo({
        url: Data.pages[e.controlId],
      })
  },

  // 显示弹窗
  showDialog: function () {
    Zan.Dialog(Data.Dialogs[0]).then(({ type }) => {
      // type 可以用于判断具体是哪一个按钮被点击
      switch (type) {
        //点击返回,用于测试,改变当前的状态为未借伞
        case 'back':
          app.globalData.CurrentStatus = all.Statuses.Unusing;
          that.changeicon();
          break;
        //点击确定获得红包
        case 'get':
          // 得到红包
          wx.navigateTo({
            url: '../myredbag/myredbag?redbag=' + wx.getStorageSync("redbag"),
          })
          break;
        default:
          break;
      }
    });
  },
  //根据当前的状态改变底部的图像
  changeicon: function () {
    let newcontrols = that.data.controls;
    newcontrols[4].iconPath = app.globalData.CurrentStatus.src;
    console.log(newcontrols);
    that.setData({
      controls: newcontrols
    })
  },

  //扫码
  getscan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      seccess: function (res) {
      }, fail(res) {
      }, complete(res) {
        //根据当前的状态选择后台传输的url
        if (app.globalData.CurrentStatus === all.Statuses.Using) {
          app.globalData.CurrentStatus = all.Statuses.Unusing;
          that.changeicon();
        } else {
          app.globalData.CurrentStatus = all.Statuses.Using;
          that.changeicon();
        }
      }
    })
  }
})
