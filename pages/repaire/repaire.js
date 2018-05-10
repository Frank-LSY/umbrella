// pages/newpage/repaire/repaire.js
const Zan = require('../../dist/index');
//请求地址
const router = require('../../router.js')
//动态数据
const Dynamic = require("../../systemcall/Storage.js");
//静态数据
const Static = require("../../systemcall/Static.js");
var that = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    using: false,
    classunclick: '',
    classclick: 'primary',
    losing: false,
    repaire: true,
  },
  showDialog: function () {
    Zan.Dialog(
      {
        title: '提示',
        message: '报失将会扣除您的押金，请点击确定继续！',
        selector: '#zan-base-dialog',
        showCancel: true,
        buttons: [{
          text: '返回', color: 'green', type: 'back'
        }, {
          text: '确定', color: 'red', type: 'confirm'
        }]
      }).then(({ type }) => {
        // type 可以用于判断具体是哪一个按钮被点击
        switch (type) {
          case 'back':
            break;
          // 点击确认
          case 'confirm':
            // 扣除押金，解除正在使用的状态，返回主界面，重新加载小程序
            if (losing) {
              that.reducemoney();
            } else {
              //报修
            }
            that.setData({ using: false })
            break;
          default:
            break;
        }
      });
  },
  reducemoney: function () {
    wx.request({
      url: router.user.deduct_deposit,
      data: {},
      method: 'POST',
      header: {
        'authenticate': wx.getStorageSync('client_sign'), //唯一标识
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.reLaunch({
          url: '../index/index'
        })
      },
      fail: function () {
        // fail
        that.failMessage()
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (DynamictgetCurrentStatus === Static.Statuses.Using) {
      that.setData({ using: true });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  },

  // 点击了报修或者报失按钮
  click: function (e) {
    this.setData({
      losing: this.data['losing'] ^ true,
      repaire: this.data['repaire'] ^ true
    })
  }
})