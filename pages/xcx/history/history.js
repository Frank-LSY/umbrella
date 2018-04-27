//获取应用实例  
var app = getApp()
Page({
    data: {
        /*** 页面配置 */
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        // 借伞数据，可改为从后台获取
        borrowList: [{
            user: 'xiaoli', time: '2017-06-11 13:59:37', status: '使用中',
            "feed_source_name": "wxy",
            "feed_source_img": "../../../images/imgs_aunt_avter.png",
        },
            {
                user: 'xiaoming', status: '使用中', time: '2017-06-11 13:59:37',
                "feed_source_name": "lmying",
                "feed_source_img": "../../../images/imgs_aunt_avter.png",
            },
            {
                user: 'xiaohua', time: '2017-06-11 15:45:10', status: '使用中',
                "feed_source_name": "swaa",
                "feed_source_img": "../../../images/imgs_aunt_avter.png",
            }],
        // 还伞数据，可改为从后台获取
        returnList: [{
            user: 'xiaoli', status: '已还', time1: '2017-06-11 13:59:37', time2: '2017-06-11 17:59:37',
            "feed_source_name": "wxy",
            "feed_source_img": "../../../images/imgs_aunt_avter.png",
        },
            {
                user: 'xiaoming', status: '已还', time1: '2017-06-11 13:59:37', time2: '2017-06-11 18:59:37',
                "feed_source_name": "lmying",
                "feed_source_img": "../../../images/imgs_aunt_avter.png",
            },
            {
                user: 'xiaohua', time1: '2017-06-11 15:45:10', status: '已还', time2: '2017-06-11 19:59:37',
                "feed_source_name": "swaa",
                "feed_source_img": "../../../images/imgs_aunt_avter.png",
            }]
    },
    onLoad: function () {
        var that = this;
        /**  * 获取系统信息 */
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }

        });
    },
    /** * 滑动切换tab*/
    bindChange: function (e) {

        var that = this;
        that.setData({currentTab: e.detail.current});

    },
    /*** 点击tab切换 */
    swichNav: function (e) {

        var that = this;

        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    }
})  
