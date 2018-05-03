//全局数据

var screenW = wx.getSystemInfoSync().windowWidth;
var screenH = wx.getSystemInfoSync().windowHeight;

module.exports={
  screenW:screenW,
  screenH:screenH,
  Statuses:{
    Unlogin: { status: 0, src: '../../images/login_register.png'},  //未登陆
    Unusing: {status:1,src:'../../images/imgs_custom_scan@2x.png'},  //已登录，未用伞
    Using:{status: 2,src:'../../images/scan.png'}   //正在用伞
  }
}