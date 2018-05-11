// pages/login/login.js
var md5 = require("../../systemcall/MD5.js")
var config = require("../../router.js")
var all = require("../../systemcall/Static.js")
var app = getApp()
var inputValue = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
  showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /*打开模态框*/
showModal: function () {
  this.setData({
    showModalStatue:true
  });
},

/*关闭模态框*/
closeModal: function () {
  app.golobalData.CurrentStatus = all.Statuses.Unusing;
  console.log("登录完成，未借伞");
  this.setData({
    showModalStatus: false
  });
},

//获取用户手机号   必须先要有login接口 在APP.js中实现
getPhoneNumber: function (e) {
  console.log(e);
  console.log(e.detail.errMsg)
  console.log(e.detail.iv)
  console.log(e.detail.encryptedData)
  if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '未授权',
      success: function (res) { }
    })
  } else {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '同意授权',
      success: function (res) { }
    })
  }
},
bindKeyInput: function (e) {
  console.log(e.detail.value);

},
chargeAgree: function (e) {
  wx.navigateTo({
    url: '../service/service'
  })
},

/*绘制模太框*/
util: function (currentStatu) {
  /* 动画部分 */
  // 第1步：创建动画实例
  var animation = wx.createAnimation({
    duration: 200, //动画时长
    timingFunction: "linear", //线性
    delay: 0 //0则不延迟
  });

  // 第2步：这个动画实例赋给当前的动画实例
  this.animation = animation;

  // 第3步：执行第一组动画
  animation.opacity(0).rotateX(-100).step();

  // 第4步：导出动画对象赋给数据对象储存
  this.setData({
    animationData: animation.export()
  })

  // 第5步：设置定时器到指定时候后，执行第二组动画
  setTimeout(function () {
    // 执行第二组动画
    animation.opacity(1).rotateX(0).step();
    // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
    this.setData({
      animationData: animation
    })

    //关闭
    if (currentStatu == "close") {
      this.closeModal();
      // this.setData({
      //     showModalStatus: false
      // });
    }
  }.bind(this), 200)

  // 显示
  if (currentStatu == "open") {
    this.showModal();
    // this.setData({
    //     showModalStatus: true
    // });
  }
},

wxloginModal: function (e) {
  var that = this;
  var login_state = wx.getStorageSync('login_state')
  login_state = 5;
  if (login_state == 2) {
    //快速登陆
    wx.request({
      url: config.user.loginUrl,
      data: {},
      method: 'POST',
      header: {
        'authenticate': wx.getStorageSync('client_sign'), //唯一标识
      },
      success: function (res) {
        app.golobalData.CurrentStatus = all.Statuses.Unusing;
        console.log("登陆完成，未借伞");
      },
      fail: function (res) {
      },

    })
  } else if (login_state == 1) {
  } else if (login_state == 3) {
    wx.redirectTo({
      url: '../index/index'
    })
  } else {//其他情况
    wx.login({ //调用登录接口
      success: function (res) {
        wx.request({ //发起网络请求
          url: config.user.loginUrl, //调用登录服务
          data: { code: res.code },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            var content = res.data.data
            var statu = res.data.re_code
            console.log(statu);
            statu = 400
            if (statu == 200 || statu == 501) //表示已登陆
            {
              if (statu == 501) {//注册用户，但缓存过期,需要重新登陆
                wx.setStorageSync('client_sign', content.server_sign) //服务器返回的唯一标识
              }

              wx.setStorageSync('login_state', 3)//已登陆标识

              if (content.identity == 'user') { //如果身份是用户
                wx.setStorageSync('switch_login', 0)  //存默认登陆小荷
                wx.reLaunch({                         //跳转
                  url: '../index/index'
                })
              } else if (content.identity == 'admin') {
                //  默认登陆小荷
                wx.setStorageSync('switch_login', 0) //设置默认登陆小荷伞标识
                wx.reLaunch({
                  url: '../index/index'
                })

              }
              console.log("已登陆标识");
            } else if (statu == 400 || statu == 500) {//未注册用户，需要注册
              wx.setStorageSync('client_sign', content.server_sign)
              // app.globalData.login_state = 1; //注册标识
              wx.setStorageSync('login_state', 1)//注册标识
              wx.redirectTo({
                url: '../Register/Register'
              })
            }
          }
        })
      }
    })
  }
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})