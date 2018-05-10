var Static = require("../systemcall/Static.js");
const Dynamic=require("../systemcall/Storage.js");
var app = getApp();
module.exports = {
  //伞点
  markers: wx.getStorageSync("umbrellapoint"),
  //**************markers*********//

  //地图上的按钮
  controls: [
    {
      //定位按钮
      id: 0, iconPath: "../../images/imgs_main_location@2x.png",
      position: {
        left: 0, top: Static.screenH - 100,
        width: 40, height: 40
      },
      clickable: true
    },
    {
      //查看雨伞分布点
      id: 1, iconPath: '../../images/ico_show_list.png',
      position: {
        left: Static.screenW - 50, top: Static.screenH - 100,
        width: 40, height: 40
      }, clickable: true
    }
    , {
      //维修按钮
      id: 2,
      iconPath: '../../images/qrode02.png',
      position: {
        left: 0, top: Static.screenH - 50,
        width: 50, height: 50
      }, clickable: true
    }, {
      //个人信息按钮
      id: 3, iconPath: '../../images/user.png',
      target: '../user/user',
      position: {
        left: Static.screenW - 50, top: Static.screenH - 50,
        width: 40, height: 40
      }, clickable: true
    },
    {
      //登录注册
      id: 4,
      position: {
        left: 0.35 * Static.screenW, top: 0.85 * Static.screenH,
        width: 0.3 * Static.screenW, height: 0.08 * Static.screenH
      },
      iconPath:"",      
      clickable: true,
    },
    { //使用说明
      id: 5, iconPath: '../../images/explain.png',
      target: '../explain/explain',
      position: {
        left: 0.12 * Static.screenW,
        top: 0.10 * Static.screenH,
        width: 0.77 * Static.screenW,
        height: 0.08 * Static.screenH
      }, clickable: true
    }],
  //******controls********************/
  addcash: "点击此处充押金：30元！",
  pages: [,'../umbrellapoint/umbrellapoint' , '../repaire/repaire', '../user/user', "../login/login", '../explain/explain'],
  GET_POSITION: 0,
  Dialogs: [
    // 领红包弹窗的内容
    {
      title: '领红包啦！',
      message: '您有一个红包未领！',
      selector:'#zan-base-dialog',
      showCancel: true,
      buttons: [{
        text: '返回', color: 'red', type: 'back'
      }, {
        text: '领取', color: 'green', type: 'get'
      }]
    },


  ]
}
