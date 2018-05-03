// pages/newpage/userecord/userecord.js
const { Tab, extend } = require('../../dist/index');

Page(extend({}, Tab, {
  data: {
    chosen: {
      list: [{
        id: 'using',
        title: '使用中'
      }, {
        id: 'used',
        title: '已完成'
      }],
      selectedId: 'using'
    }
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
  },
    onLoad: function () {
      this.setData({
        borrowtime: new Date().getTime(),
        usedtime:3
      });
    } 
}));