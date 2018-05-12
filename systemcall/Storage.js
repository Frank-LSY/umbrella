
module.exports={
  //存储用户信息
  setUserInfo:function(user){
    wx.setStorageSync("userInfo",user );
  },
  getUserInfo:function(){
    return wx.getStorageSync("userInfo");
  },
  //存储余额
  setBlance(blance){
    wx.setStorageSync("blance", blance);
  },
  getBlance(){
    return wx.getStorageSync("blance");
  },
  //存储当前状态
  setCurrentStatus(status){
    wx.setStorageSync("currentStatus", status);
  },
  getCurrentStatus() {
    return wx.getStorageSync("currentStatus");
  },
  //存储押金
  setCashPledge(cashpledge){
    wx.setStorageSync("cashPledge", cashpledge);
  },
  getCashPledge(){
    return wx.getStorageSync("cashPledge");
  },
  //存储电话号码
  setPhoneNumber(phonenumber){
    wx.setStorageSync("phoneNumber", phonenumber);
  },
  getPhoneNumber(){
    return wx.getStorageSync("phoneNumber");
  },
  //已领红包
  setHadRedBag(money){
    wx.setStorageSync("hadRedBag", money);
  },
  getHadRedBag(){
    return wx.getStorageSync("hadRedBag");
  },
  //未领红包
  setRedBag(money){
    wx.setStorageSync("redBag", money);
  },
  getRedBag(){
    return wx.getStorageSync("redBag");
  },
  //需要的钱
  setNeedMoney(money){
    wx.setStorageSync("needMoney", money);
  },
  getNeedMoney(){
    return wx.getStorageSync("needMoney");
  }
}