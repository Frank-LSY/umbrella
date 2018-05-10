const Data=require("Data.js");
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
    Data.balance=blance;
  },
  getBlance(){
    return Data.balance;
  },
  //存储当前状态
  setCurrentStatus(status){
    Data.currentStatus=status;
  },
  getCurrentStatus(status) {
    return Data.currentStatus; 
  },
  //存储押金
  setCashPledge(cashpledge){
    Data.cashPledge = cashpledge;
  },
  getCashPledge(){
    return Data.cashPledge;
  },
  //存储电话号码
  setPhoneNumber(phonenumber){
    Data.phoneNumber=phonenumber;
  },
  getPhoneNumber(){
    return Data.phoneNumber;
  },
  //已领红包
  setHadRedBag(money){
    Data.hadRedBag=money;
  },
  getHadRedBag(money){
    return Data.hadRedBag;
  },
  //未领红包
  setRedBag(money){
    Data.redBag=money;
  },
  getRedBag(){
    return Data.redBag;
  },
  //需要的钱
  setNeedMoney(money){
    Data.needMoney=money;
  },
  getNeedMoney(){
    return Data.needMoney;
  }
  
}