// pages/newpage/Register/Register.js
var config = require("../../router.js")
Page({
  data: {
    flag: true,
    flag2: true,
    input: false,
    notinput: true,
    // appid: 'wx5a98b010846f53f5',//appid需自己提供
    // secret: '1d57c3992889cb86b8b9a6d752607fdd',//secret需自己提供,有后台获取并与微信服务器进行交互
    getCodeBtnProperty: {
      titileColor: '#B4B4B4',
      disabled: true,
      loading: false,
      title: '获取验证码'
    },
    loginBtnProperty: {
      disabled: true,
      loading: false,
    },
    getCodeParams: {
      token: 'umbrella-token',
      mobile: 123456,
      checksum: '',
    },
    registerParams: {
      mobile: '',
      code: '',
      verification: '',
      nickname: '',//昵称
      head: '',//头像

    },
    codeTfFocus: false,

    //校验码
    SALT: "AIRBIKESALT",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {


  },

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
    var that = this
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res) {
              console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: '192.168.0.103/xhs/manage_area/WXPhone/wxPhone',//自己的服务接口地址
                method: 'get',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: { encryptedData: e.detail.encryptedData, 
                                   iv: e.detail.iv, 
                                   code: code 
                                   },
                success: function (data) {

                  //4.解密成功后 获取自己服务器返回的结果
                  if (data.data.status == 1) {
                    var userInfo_ = data.data.userInfo;
                    console.log(userInfo_)
                    this.setData({
                      input: false,
                      notinput: true,
                    })
                    console.log(userInfo_.phoneNumber)

                  } else {
                    console.log('获取失败');
                  }

                },
                fail: function () {
                  console.log('系统错误');
                }
              })
            },
            fail: function () {
              console.log('获取用户信息失败');
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg);
        }
      },
      fail: function () {
        console.log('登陆失败');
      }
    })
  },

  inputmobil: function (e) {
    var that = this;
    var inputValue = e.detail.value
    this.setData({
      'getCodeParams.mobile': inputValue,
      'registerParams.mobile': inputValue,
    })
    console.log(inputValue);
  },

  modalinput: function () {
    var that = this;
    this.setData({
      flag: !this.data.flag,
    })
    console.log(that.data.getCodeParams)
    wx.request({
      url: config.user.getcode,
      data: that.data.getCodeParams,
      method: 'POST',
      header: {
        'authenticate': wx.getStorageSync('client_sign'), //唯一标识
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(that.data.getCodeParams)
        var content = res.data.data
        var message = res.data.code_info
        var statu = res.data.re_code
        if (statu == 200) {
          wx.showToast({
            title: '获取成功，请在60秒内输入',
            icon: 'success',
            duration: 4000,
          })
          //启动定时器
          var number = 60;
          var time = setInterval(function () {
            number--;
            that.setData({
              'getCodeBtnProperty.title': number + '秒',
              'getCodeBtnProperty.disabled': true
            })
            if (number == 0) {
              that.setData({
                'getCodeBtnProperty.title': '重新获取',
                'getCodeBtnProperty.disabled': false
              })
              clearInterval(time);
            }
          }, 1000);
        } else {
          wx.showToast({
            title: '注册登录:\n' + message,
            icon: 'loading',
            duration: 2000,
          })
        }
        //光标下移
        that.setData({
          'codeTfFocus': true
        })
      },
      fail: function (res) {
        // fail
        console.log(res)
        that.failMessage()
      },
      complete: function () {
        // complete
        //隐藏loading
        that.setData({
          'getCodeBtnProperty.loading': false
        })
      },
    })
  },

  cancle: function () {
    this.setData({
      flag: true
    });
  },

  confirm: function () {
    var that = this;
    this.setData({
      flag: true,
      'codeTfFocus': true
    })
    wx.login({ //调用登录接口重新登录
      success: function (res) {
        if (res.code) { //获得用户登录凭证
          var user_info = wx.getStorageSync('user_info');
          that.setData({
            'registerParams.head': user_info.avatarUrl,
            'registerParams.nickname': user_info.nickName,
            'registerParams.code': res.code,
            //显示loading
            'loginBtnProperty.loading': true
          })
          wx.request({
            url: config.user.registerUrl,
            data: that.data.registerParams,
            method: 'GET',
            header: {
              'authenticate': wx.getStorageSync('client_sign'), //唯一标识
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              // success
              console.log(res.data);

              var message = res.data.code_info
              var statu = res.data.re_code
              var content = res.data.data

              if (statu == 200) {
                console.log('注册成功')
                wx.setStorageSync('login_state', 3) //默认登陆标识
                wx.setStorageSync('switch_login', 0) //默认登陆标识
                wx.reLaunch({
                  url: '../index/index'
                })
              } else {
                wx.showToast({
                  title: '错误:\n' + message,
                  icon: 'warning',
                  duration: 4000,
                })
              }
            },
            /********yh_start********/
            fail: function () {
              // fail

            },
            complete: function () {
              // complete
              //隐藏loading
              that.setData({
                'loginBtnProperty.loading': false
              })
            }
          })


        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

  },


  codeTfInput: function (e) {
    console.log(e)
    var that = this
    var inputValue = e.detail.value
    var length = e.detail.value.length
    if (length == 4) {
      //给接口的mobile参数赋值,以及改变获取验证码的状态
      that.setData({
        'loginBtnProperty.disabled': false,
        'registerParams.verification': inputValue
      })
    } else {
      //给接口的mobile参数赋值,以及改变获取验证码的状态
      that.setData({
        'loginBtnProperty.disabled': true,
        'registerParams.verification': ''
      })
    }
  },
})