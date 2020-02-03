// pages/advance/advance.js
let that;
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    user: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 获取用户输入
   */
  formSubmit (e) {
    this.data.content = e.detail.value['input-content'];
    this.data.title = e.detail.value['title'];
    if (this.data.canIUse) {
      if (this.data.title.trim() != '') {
        this.saveDataToServer();
      } else if (this.data.content.trim() != '') {
        this.saveDataToServer();
      } else {
        wx.showToast({
          title: '给我们些意见吧',
          icon: 'none'
        })
      }
    } else {
      this.jugdeUserLogin();
    }
  },
  /**
   * 保存数据
   */
  saveDataToServer () {
    this.showTipAndSwitchTab();
  },
  /**
   * 添加成功切换页面
   */
  showTipAndSwitchTab () {
    db.collection('advanceDemo')
      .add({
        data: {
          title: that.data.title,
          content: that.data.content
        },
        success: res => {
          wx.showToast({
            title: '反馈成功，请留意',
            icon: 'none',
            duration: 500
          });
          wx.navigateTo({
            url: '/pages/home/home',
          });
        },
        fail: console.error
      })
  },
  /**
 * 获取登录用户信息权限
 */
  jugdeUserLogin() {
    // 判断是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //已授权，直接调用getUserInfo
          wx.getUserInfo({
            success: res => {
              that.data.userInfo = res.userInfo;
            }
          })

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.jugdeUserLogin();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})