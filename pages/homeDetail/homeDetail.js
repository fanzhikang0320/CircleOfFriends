// pages/homeDetail/homeDetail.js

let that;
const db = wx.cloud.database();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    id: '',
    openid: '',
    isLike: false
  },
  /**
   * 预览图片
   */
  previewImg (e) {
    let index = e.currentTarget.dataset.index;

    wx.previewImage({
      current: that.data.topic.images[index],
      urls: that.data.topic.images,
    })
  },
  /**
   * 是否喜欢
   */
  onLikeClick (e) {
    if (that.data.isLike) {
      //已喜欢时取消喜欢
      that.removeFormCollectServer();
    } else {
      //添加收藏
      that.saveToCollectServer();
    }
  },
  /**
   * 
   */
  removeFormCollectServer () {

  },
  /**
   * 添加收藏
   */
  saveToCollectServer () {
    db.collection('collectDemo').add({
      data: {
        id: that.data.id,
        date: new Date(),
      },
      success: res => {
        //刷新喜欢图标
        that.refreshLikeIcon(true);
      },
      fail: console.error
    });
  },
  /**
   * 刷新图标
   */
  refreshLikeIcon (isLike) {
    that.data.isLike = isLike;
    that.setData({
      isLike: that.data.isLike
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.data.id = options.id;
    this.data.openid = options.openid;
    //获取话题信息
    db.collection('topicDemo')
      .doc(that.data.id)
        .get({
          success: res => {
            res.data.date = String(res.data.date);
            that.data.topic = res.data;
            that.setData({
              topic: that.data.topic
            });
          }
        });
    // 获取收藏喜欢状态
    db.collection('collectDemo')
      .where({
        _openid: that.data.openid,
        _id: that.data.id
      })
      .get({
        success: res => {
          if (res.data.length > 0) {
            that.refreshLikeIcon(true);
          } else {
            that.refreshLikeIcon(false);
          }
        },
        fail: console.error
      })
  },

})