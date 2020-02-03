// pages/reply/reply.js
let that;
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    openid: '',
    content: ''
  },
  /**
   * 获取用户输入的值
   */
  bindkeyInput (e) {
    that.data.content = e.detail.value;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.data.id = options.id;
    that.data.openid = options.openid;
  },
/**
 * 发布神评
 */
  saveReplay () {
    db.collection('replayDemo')
      .add({
        data: {
          content: that.data.content,
          date: new Date(),
          r_id: that.data.id,
          u_id: that.data.openid,
          t_id: that.data.id
        },
        success: res => {
          wx.showToast({
            title: '发表成功',
            icon: 'none',
            duration: 500
          });
          setTimeout( () => {
            wx.navigateTo({
              url: '/pages/homeDetail/homeDetail?id=' + that.data.id + '&openid=' + that.data.openid,
            })
          },500)
        }
      })
  }
})