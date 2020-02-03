// pages/history/history.js
let that;
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    page: 0,
    pageSize: 5,
    totalCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getData(this.data.page);
  },
  /**
   * 获取数据
   */
  getData () {
    db.collection('topicDemo')
      .count({
        success: res => {
          that.data.totalCount = res.total;
        }
      })
    try {
      db.collection('topicDemo')
        .where({
          _openid: app.globalData.openid
        })
          .limit(that.data.pageSize)
            .orderBy('date','desc')
              .get({
                success: res => {
                  that.data.topic = res.data;
                  that.setData({
                    topic: that.data.topic
                  });
                  wx.hideNavigationBarLoading();
                  wx.stopPullDownRefresh();
                },
                fail: res => {
                  wx.hideNavigationBarLoading();
                  wx.stopPullDownRefresh();
                }
              })
    } catch (e) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },
  /**
   * 具体查看某条朋友圈
   */
  onItemClick (e) {
    let id = e.currentTarget.dataset.topicid;
    let openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/homeDetail/homeDetail?id=' + id + '&opendid=' + openid ,
    })
  },
 

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    that.getData(this.data.page);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var temp = [];
    if (this.data.topic.length < this.data.totalCount) {
      try {
        db.collection('topicDemo')
          .where({
            _openid: app.globalData.openid
          })
            .skip((that.data.page + 1) * that.data.pageSize)
              .limit(that.data.pageSize)
                .orderBy('date','desc')
                  .get({
                    success: res => {
                      if (res.data.length > 0) {
                        for (let i = 0 ; i < res.data.length ; i ++) {
                          let  tempTopic = res.data[i];
                          temp.push(tempTopic);
                        }
                        let totalTopic = {};
                        totalTopic = that.data.topic.concat(temp);
                        that.setData({
                          topic: totalTopic
                        });
                      } else {
                        wx.showToast({
                          title: '没有更多数据啦！',
                          icon: 'none'
                        })
                      }
                    }
                  })
      } catch (e) {
        console.log(e);
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})