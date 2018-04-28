//小程序配置文件

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://76582212.qcloud.la';
//var host = 'http://192.168.0.125/xiaohesan';   
var u_host = `${host}/xcx/index.php`;//用户地址
var a_host = `${host}/auntie/index.php`;//管理员地址

var config = {
    uploads: `${host}/admin/uploads`,//图片
    user: {
        u_host,
        // 登录地址，用于建立会话
        loginUrl: `${u_host}/login/check_login`,//登陆态检查
        registerUrl: `${u_host}/login/check_register`,//注册检查
        getcode: `${u_host}/login/get_code`,//获取验证码
        unlock_check: `${u_host}/homepage/borrow`,//借伞
        lock_check: `${u_host}/homepage/back`,//还伞
        homepage: `${u_host}/homepage/index`,//主页
        get_useRecord: `${u_host}/homepage/get_use_record`,//用户使用记录
        get_station_location: `${u_host}/homepage/station_location`,//伞点位置
        get_record_time: `${u_host}/use_record/get_record_time`,//用户使用时间
        my_wallet: `${u_host}/my_wallet/index`,///获得当前余额
        charge_over: `${u_host}/my_wallet/charge_over`,//充值余额
        charge_deposit: `${u_host}/my_wallet/charge_deposit`,//充值押金
        query_deposit: `${u_host}/my_wallet/query_deposit`,//获得可退押金
        refund_deposit: `${u_host}/my_wallet/refund_deposit`,//申请退押金
        station_info: `${u_host}/station/index`,//站点信息
        apply_admin: `${u_host}/user/apply_admin`,//申请成为塘主
        pay_record: `${u_host}/pay_record/index`,//交易记录
        use_record: `${u_host}/use_record/index`,//用户使用记录
        user_info: `${u_host}/user/index`,//用户信息
        login_out: `${u_host}/user/login_out`,//退出登陆
        paymentUrl: `${u_host}/payment/give_money`,//支付接口
        query_redbag: `${u_host}/redbag/user_redbag`,//查询红包
        redbag_notice: `${u_host}/redbag/redbag_notice`,//查询红包
        get_redbag: `${u_host}/redbag/get_redbag`,//获得红包
        sponsor: `${u_host}/sponsor/activity`,//商家和活动
        deduct_deposit: `${u_host}/user/deduct_deposit`,//报失扣押金
    },

    auntie: {
        a_host,
        // 登录地址，用于建立会话
        loginUrl: `${a_host}/login/check_login`,//登陆态检查
        getcode: `${a_host}/login/get_code`,//获取验证码
        registerUrl: `${a_host}/login/check_register`,//注册检查
        edit_userInfo: `${a_host}/admin/edit`,//修改个人信息
        upload_userInfo: `${a_host}/admin/auntie_edit`,//修改信息上传
        use_record: `${a_host}/use_record/record`,//站点的借还伞记录
        repair_info: `${a_host}/repair/index`,//报修信息
        station_repair: `${a_host}/repair/station_repair`,//站点报修
        station_info: `${a_host}/station/index`,//站点信息
        admin_info: `${a_host}/admin/index`,//阿姨信息
        admin_home: `${a_host}/admin/auntie`,//阿姨主界面
        wage_record: `${a_host}/wage_record/index`,//工资记录
        notice: `${a_host}/admin_notice/index`,//通知信息
        check_umbrella: `${a_host}/use_record/check_umbrella`,//通知信息
        update_qr: `${a_host}/admin_notice/update_code`,//更新二维码
    },

};

module.exports = config;//实例化
