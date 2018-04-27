var config = require('../../../config');
Page({
    data: {
        numberArr: [],
        uploads_url: '46446',
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this

        that.setData({
            uploads_url: config.uploads
        })

        //playingList
        wx.request({
            url: config.user.station_info,
            success: function (res) {
                var content = res.data.data;
                that.data.items = res.data;
                console.log(content);
                console.log(content[0].sponsor.logo);
                that.setData({//this.setdata很重要
                    numberArr: content,

                })
            }
        })
    },
    //去赞助商
    toSponsor: function (e) {
        var that = this;
        console.log(e);
        wx.redirectTo({
            url: '../sponsor/sponsor?sponsor_id=' + e.currentTarget.dataset.sp
        })
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '伞分布列表'
        })
    },
})
