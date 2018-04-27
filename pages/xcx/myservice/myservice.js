var md5 = require("../../../utils/MD5.js")
var config = require('../../../config');
Page({
    data: {
        QandA: [
            {
                'name': '使用说明',
                'id': 1
            },
            {
                'name': '疑问指南',
                'id': 2
            }
        ]
    },
    onLoad: function (options) {

    },
    QandADetail: function (e) {
        var id = e.target.id;
        switch (id) {
            case "1":
                wx.navigateTo({
                    url: '../explain/explain',
                })
                break;
            case "2":
                wx.navigateTo({
                    url: '../guide/guide',
                })
                break;
            case "3":
                break;
        }
    }

})
