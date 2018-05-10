
module.exports = {
  //全局数据

  screenW:wx.getSystemInfoSync().windowWidth,
  screenH:wx.getSystemInfoSync().windowHeight,
  Statuses: {
      Unregister: { status: 0, src: '../../images/login_register.png' },  //未登陆
      Registered: { status: 1, src: '../../images/imgs_custom_scan@2x.png' },//已登录
      Unusing: { status: 2, src: '../../images/imgs_custom_scan@2x.png' },  //已登录，未用伞
      Using: { status: 3, src: '../../images/scan.png' }   //正在用伞
    }

}
