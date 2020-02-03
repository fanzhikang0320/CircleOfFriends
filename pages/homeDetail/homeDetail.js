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
    isLike: false,
    replays:[]
  },
  /**
   * 获取回复列表
   */
  getReplay () {
    db.collection('replayDemo')
      .where({
        t_id: that.data.id
      })
      .get({
        success: res => {
          that.setData({
            replays: res.data
          });
        },
        fail: console.error
      })
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
   * 取消喜欢
   */
  removeFormCollectServer () {
    //删除数据库当中的记录
    db.collection('collectDemo')
      .doc(that.data.id)
        .remove({
          success: res => {
            that.refreshLikeIcon(false);
          }
        })
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
   * 回复
   */
  onReplayClick() {
    //通过id和openid进行跳转
    wx.navigateTo({
      url: '/pages/reply/reply?id=' + that.data.id + '&openid=' + that.data.openid
    })
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
  onShow: function () {
    this.getReplay();
  }
})