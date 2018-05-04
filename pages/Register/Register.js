// pages/newpage/Register/Register.js
var config=require("../../router.js")
Page({
  data: {
    flag:true,
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
      mobile: '',
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
  onLoad: function (options) {
  
  },

  modalinput: function () {
    var that = this;
    this.setData({
      flag: !this.data.flag,
      'getCodeBtnProperty.loading': true,
      'getCodeParams.mobile': '12345678911',
      'registerParams.mobile': '12345678911',
      'getCodeBtnProperty.titileColor': '#34B5E3',
      'getCodeBtnProperty.disabled': false
    })
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