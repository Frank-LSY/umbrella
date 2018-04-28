//配置文件
var config = require('./config');

App({
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口  
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    LoginStatus: false,
    Balance: 1,
    CashPledge: 0,
    using: false,
    code: '', //使用状态0表示正常,1表示使用中,2表示结束了使用

  } ,
  onLaunch: function () {
    var that = this;
    console.log('小程序加载...')
    //获得用户的信息
    wx.getUserInfo({
      success: function (res) {
        wx.setStorageSync('user_info', res.userInfo)
      },
      cancel: function () {
        wx.setStorageSync('login_state', 0)//未授权
      }
    });

    //调用系统API获取设备信息
    wx.getSystemInfo({
      success: function (res) {
        var kScreenW = res.windowWidth / 375
        var kScreenH = res.windowHeight / 603
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)
        console.log('设备信息:')
        console.log(res)
      }
    });
    //login接口调用
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求  
          console.log(res.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    //真正的登陆
    wx.getSetting({//权限检查
      success(res) {
        if (!res.authSetting['scope.userInfo'] || !res.authSetting['scope.userLocation']) {
          console.log('用户没赋权！');
          wx.setStorageSync('login_state', 0)//未授权
        } else {
          if (wx.getStorageSync('client_sign')) {//本地识别码缓存存在
            wx.checkSession({ //微信缓存接口，判断用户登陆态是否过期
              success: function () { //登陆状态未过期，并且在本生命周期一直有效
                that.requestLogin();       //登陆检查
                console.log('登陆状态未过期！');
              },
              fail: function () { //登陆状态已过期
                wx.removeStorageSync('client_sign')
                that.doLogin();
              },
            })
          } else {//本地识别码缓存不存在
            that.doLogin();
          }
        }
      }
    })
  },//onLaunch结束

  //一般请求
  requestLogin: function () {
    var that = this
    wx.request({ //发起网络请求
      url: config.user.loginUrl,//调用登录服务
      data: { code: that.globalData.code },
      header: {
        'authenticate': wx.getStorageSync('client_sign'), //唯一标识
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var content = res.data.data
        var status = res.data.re_code
        if (status == 200 || status == 501) { //表示已登陆
          if (status == 501) {//注册用户，但缓存过期,需要重新登陆
            wx.setStorageSync('client_sign', content.server_sign) //服务器返回的唯一标识
          }
          wx.setStorageSync('login_state', 3)//已登陆标识
          if (content.identity == 'admin') {
            if (wx.getStorageSync('switch_login') == 1 || content.is_user == 0) {//默认登陆阿姨端
              wx.setStorageSync('switch_login') == 1;
              wx.reLaunch({
                url: 'pages/auntie/index/index'
              })
            }
          }
          console.log('登陆成功！');
        } else if (status == 400 || status == 500) {//未注册用户，需要注册
          wx.setStorageSync('client_sign', content.server_sign) //服务器返回的唯一标识
          wx.setStorageSync('login_state', 1)//注册标识
          console.log('请注册！');
        } else if (status == 503) {
          wx.setStorageSync('login_state', 4)//服务器缓存过期
          console.log('缓存过期，请重新登陆！');
        }
      }
    })
  },


  //session过期-重新登陆请求
  doLogin: function () {
    var that = this
    wx.login({ //调用登录接口重新登录
      success: function (res) {
        if (res.code) { //获得用户登录凭证
          that.globalData.code = res.code;
          that.requestLogin();
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }
})

