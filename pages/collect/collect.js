// pages/collect/collect.js
let that;
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 5,
    totalCount: 0,
    topic: [],
    collects: {}
  },

  onLoad: function (options) {
    that = this;
  },
  onShow: function () {
    this.getData(this.data.page);
  },
  /**
   * 获取数据
   */
  getData: function (page) {
    db.collection('collectDemo')
      .where({
        _openid: app.globalData.opendId
      })
      .get({
        success: res => {
          that.data.collects = res.data;
          that.getTopicFromCollect();
        }
      })
  },
  /**
   * 根据id获取话题
   */
  getTopicFromCollect () {
    var tempTopic = {};
    for (let i = 0 ; i < that.data.collects.length ; i ++) {
      let topicId = that.data.collects[i].id;
      //去话题数据表找数据
      db.collection('topicDemo')
        .doc(topicId)
          .get({
            success: res => {
              that.data.topic.push(res.data);
              that.setData({
                topic: that.data.topic
              });
            },
            fail: console.error
          })
    }
  }

})