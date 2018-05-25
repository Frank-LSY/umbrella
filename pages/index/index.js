//zanUI 的包
const Zan = require('../../dist/index');
//数据模块
var Data = require('../../data/index.js');
//功能模块，充值
var Function = require("../../systemcall/function.js");
//请求地址
var router = require('../../router.js')
//动态数据
const Dynamic = require("../../systemcall/Storage.js");
//静态数据

const Static=require("../../systemcall/Static.js")

var timer=''; //计时器
var that = null;
var app = getApp();

Page({
  // 页面数据
  data: {
    mapCtx:null,
    longitude: 0,
    latitude: 0,
    markers: Data.markers,    //伞点
    polyline: Data.polyline,    //路线
    controls: Data.controls,    //地图上的控点
    imformation: "您需要充值押金或余额才能借伞！", //提示信息
    needmoney: Dynamic.getNeedMoney(),
    seconds: 0,
    time: '00:00:00',
    cost: 0,
    using: false
  },
  onLoad: function () {
    that = this;
    Dynamic.setCurrentStatus(Static.Statuses.Unusing)
    this.changeicon();    //查看当前状态改变底部的按钮图片
    if (Dynamic.getRedBag() !== 0) {  //是否有红包要领
      this.showDialog(Data.Dialogs[0]); //显示领红包的dialog
    }
    this.setusing();
  },
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map');
    this.click(0)
  },

  // 得到地图中心的位置
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res)
      }
    })
  },
  //中心移动到定位处
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  //移动标记点
  translateMarker: function () {
    this.mapCtx.translateMarker({
    })
  },
  //点击去充值
  addmoney: function () {
    Function.addmoney(30);
  },

  //点击地图上的controls
  click: function (num) {
    switch (num) {
      case Data.GET_POSITION:
        this.getCenterLocation();
        this.moveToLocation();
        break;
      default:
        break;
    }
  },
  regionchange(e) { },
  markertap(e) { },

  // 对地图的上的controls点击事件绑定
  controltap(e) {
    this.click(e.controlId);
    // 扫码
    if (e.controlId === 4 && Dynamic.getCurrentStatus().status !== 0) {
      that.getscan();
    } else if (e.controlId >= 1) {
      wx.navigateTo({
        url: Data.pages[e.controlId],
      })
    }
  },

  // 显示弹窗
  showDialog: function (Dialogs) {
    Zan.Dialog(Dialogs).then(({ type }) => {
      // type 可以用于判断具体是哪一个按钮被点击
      switch (type) {
        case 'back':
          break;
        case 'get':
          wx.navigateTo({
            url: '../myredbag/myredbag',
          })
          break;
        default:
          break;
      }
    });
  },
  //根据当前的状态，改变地图上控件的图片
  changeicon: function () {
    let newcontrols = that.data.controls;
    newcontrols[4].iconPath = Dynamic.getCurrentStatus().src;
    that.setData({ controls: newcontrols })
  },
  //调用扫码
  getscan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      seccess: function (res) {
      }, fail(res) {
      }, complete(res) {
        if (Dynamic.getCurrentStatus().status === Static.Statuses.Using.status) {
          Dynamic.setCurrentStatus(Static.Statuses.Unusing);
          that.changeicon();
        } else {
          Dynamic.setCurrentStatus(Static.Statuses.Using);
          that.changeicon();
        }
        that.setusing();
      }
    })
  },
  //改变使用状态，控制计时窗口
  setusing: function () {
    that.setData({
      using: Dynamic.getCurrentStatus().status === Static.Statuses.Using.status ? true : false
    })
  },
  //借伞时得到时间
  settime: function () {
    let times = Function.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      times: times
    });
    timing(this);
  }
})

function timing(that) {
  var seconds = that.data.seconds
  if (seconds > 21599) {
    that.setData({
      time: 'time is too long'
    });
    return;
  }
  timer=setTimeout(function () {
    that.setData({
      seconds: seconds + 1
    });
    timing(that);
  }
    , 1000)
  formatSeconds(that)
}
function formatSeconds(that) {
  var mins = 0, hours = 0, seconds = that.data.seconds, time = ''
  if (seconds < 60) {

  } else if (seconds < 3600) {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
  } else {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
    hours = parseInt(mins / 60)
    mins = mins % 60
  }
  that.setData({
    time: formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(seconds),
  })
}
function formatTime(num) {
  if (num < 10)
    return '0' + num
  else
    return num + ''
}

