//zanUI 的包
const Zan = require('../../dist/index');
//数据模块
var Data = require('../../data/index.js');
//全局变量
var all = require('../../data/all.js');
var time = require('../../systemcall/getTime.js')
var router = require('../../router.js')
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
    needmoney: wx.getStorageSync("needmoney"),
    seconds: 0,
    time: '00:00:00',
    cost: 0,
    using: false
  },
  onLoad: function () {
    that = this;
    this.changeicon();    //查看当前状态改变底部的按钮图片
    if (wx.getStorageSync("redbag") !== 0) {
      this.showDialog();
    }
    this.setusing();
    var times = time.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      times: times
    });
    timing(this);
    charging(this);
    wx.request({
      url: '',//router.user.time,//传送时间
      data: {
        time
      },
      method: 'GET',
      success: function (res) {

      },
      fail: function () {

      },
      complete: function () {

      }
    });
    // function settime(that) {
    //   var second = that.data.second
    //   that.setData({
    //    hour: (second / 3600),
    //     mintue: (second - hour * 3600) / 60,
    //   second: (second - hour * 3600 - mintue * 60)
    //  });
    //  return;
    //  var time = setTimeout(function () {
    //    that.setData({
    //      second: second + 1

    //   }); 
    //    console.log(second)
    //    countdown(that);
    //   }
    //   , 1000)
    //  }
    this.changeicon();    //查看当前状态
    console.log(wx.getStorageSync("needmoney")); .0
  },
  onShow: function () {
  },
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map');
    this.getCenterLocation();
    this.moveToLocation();
    if (wx.getStorageSync("redbag") !== 0) {
      this.showDialog();
    }
  },

  // 得到地图中心的位置
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        // console.log(res.longitude)
        // console.log(res.latitude)
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

    // 充值记录
    wx.request({
      url: router.user.paymentUrl,
      data: {
        rechargeNum: 30, //充值金额
        rechargeType: 1 //充值类型
      },
      method: 'POST',
      header: {
        'authenticate': wx.getStorageSync('client_sign'), //唯一标识
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        /***开始支付请求***/
        wx.requestPayment({

          //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
          timeStamp: res.data.timeStamp,
          //随机字符串，长度为32个字符以下。
          nonceStr: res.data.nonceStr,
          //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
          package: res.data.package,
          //签名算法，暂支持 MD5
          signType: 'MD5',
          //签名
          paySign: res.data.paySign,
          //支付成功，开始更新用户余额
          success: function (res) {
            wx.setStorageSync("needmoney", 0);
            that.setData({
              needmoney: 0
            })
            // 更新余额
            wx.request({
              url: res.user.charge_over,
              data: {
                "over": 30, //充值金额
              },
              method: 'POST',
              header: {
                'authenticate': wx.getStorageSync('client_sign'), //唯一标识
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
              }//endsuccess
            })//endreqquest
          },
          fail: function (res) {
          },
          complete: function (res) {
            wx.setStorageSync("needmoney", 0);
            that.setData({
              needmoney: 0
            })
          }
        })
      }
    })
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
  regionchange(e) { console.log(e.type) },
  markertap(e) { console.log(e.markerId) },

  // 对地图的上的controls点击事件绑定
  controltap(e) {
    console.log(e.controlId);
    this.click(e.controlId);
    // 扫码
    if (e.controlId === 4 && app.globalData.CurrentStatus.status !== 0) {
      that.getscan();
    } else if (e.controlId >= 1)
      wx.navigateTo({
        url: Data.pages[e.controlId],
      })
  },

  // 显示弹窗
  showDialog: function () {
    Zan.Dialog(Data.Dialogs[0]).then(({ type }) => {
      // type 可以用于判断具体是哪一个按钮被点击

      switch (type) {
        case 'back':
          app.globalData.CurrentStatus = all.Statuses.Unusing;
          that.changeicon();

          break;
        default:
          break;
      }
      console.log('=== dialog with custom buttons ===', `type: ${type}`);
    });
  },
  changeicon: function () {
    let newcontrols = that.data.controls;
    newcontrols[4].iconPath = app.globalData.CurrentStatus.src;
    // console.log(newcontrols);
    that.setData({
      controls: newcontrols
    })
  },
  getscan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      seccess: function (res) {
      }, fail(res) {
      }, complete(res) {
        if (app.globalData.CurrentStatus === all.Statuses.Using) {
          app.globalData.CurrentStatus = all.Statuses.Unusing;
          that.changeicon();
        } else {
          app.globalData.CurrentStatus = all.Statuses.Using;
          that.changeicon();
        }
        that.setusing();
      }
    })
  },
  setusing: function () {
    if (app.globalData.CurrentStatus === all.Statuses.Using) {
      that.setData({
        using: true
      })
    } else {
      that.setData({
        using: false
      })
    }
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
  setTimeout(function () {
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
    time: formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(seconds)
  });
}
function formatTime(num) {
  if (num < 10)
    return '0' + num
  else
    return num + ''
}
function charging(that) {
  if (that.data.seconds < 600) {
    console.log("pay some money")
  }
}
