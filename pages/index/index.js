//zanUI 的包
const Zan = require('../../dist/index');
//数据模块
var Data = require('../../data/index.js');

var all=require('../../data/all.js');
var that = null;
var app = getApp();

Page(Object.assign({}, Zan.NoticeBar, Zan.Dialog, {
  // 页面数据
  data: {
    longitude: null,
    latitude: null,
    markers: Data.markers,
    polyline: Data.polyline,
    controls: Data.controls,
    imformation:"您需要充值押金或余额才能借伞！",
    needmoney:wx.getStorageSync("needmoney")
  },
  onLoad: function () {
    that = this;
  },
  onShow:function(){
  },
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map');
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

  //移动标记点
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
addmoney:function(){
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
      success:function(res){
        wx.setStorageSync("needmoney", 0);
      },fail:function(res){
      }
    })
}
,
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
    // 点击了用户
    if (e.controlId>=1)
      wx.navigateTo({
        url: Data.pages[e.controlId],
      })
  },

  // 显示弹窗
  showDialog: function () {
    console.log("已点击");
    console.log(that.data.controls)
    app.globalData.CurrentStatus=all.Statuses.Unusing;
    let newcontrols=that.data.controls;
    newcontrols[4].iconPath=app.globalData.CurrentStatus.src;
    console.log(newcontrols);
    that.setData({
      controls:newcontrols
    })
    this.showZanDialog(Data.Dialogs[0]).then(({ type }) => {
      // 对点击的按钮进行判断
      
      switch (type) {
        case 'back':
          console.log('=== dialog ===', 'type: cash');
          break;
        case 'get':
          console.log('=== dialog ===', 'type: get');
          //点击领取红包，得到红包，跳转到我的红包
          wx.navigateTo({
            url: '../myredbag/myredbag',
          })
          break;
        default:
          break;
      }
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  }
})
)