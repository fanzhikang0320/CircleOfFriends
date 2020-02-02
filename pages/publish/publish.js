// pages/publish/publish.js
let that;
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    userInfo: {},
    content: '',
    isLike: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
// 选择图片
chooseImage () {
  wx.chooseImage({
    count: 6,
    success: function(res) {
      // console.log(res);
      that.setData({
        images: res.tempFilePaths
      });
      //图片上传
      that.data.images = [];
      for (let i in res.tempFilePaths) {
        //将图片上传至云存储
        wx.cloud.uploadFile({
          cloudPath: that.timetostr(new Date()), //上传至云端的路径
          filePath: res.tempFilePaths[i], //小程序临时文件路径
          success: function (res) {
            // res.fileID
            // console.log(res);
            that.data.images.push(res.fileID);
          },
          fail: res => {
            console.error
          }
        });
      }
    },
  })
}, 
/**
 * 图片时间的重置名（自定义）
 */
timetostr (time) {
  let random = Math.floor(Math.random() * (9999 - 1000) + 1000);
  let str = random + '_' + time.getMilliseconds() + '.png';
  return str;
},
/**
 * 获取登录用户信息权限
 */
  jugdeUserLogin () {
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
 * 表单提交
 */
formSubmit (e) {
  //获取用户输入内容
  that.data.content = e.detail.value['input-content'];
  // 先判断用户是否授权获取信息
  if (this.data.canIUse) {
    // 如果用户选择了图片或者写了内容就进行上传
    if (this.data.images.length > 0 || this.data.content.trim() != '') {
      this.saveDataToServer();
    } else {
      wx.showToast({
        title: '写点什么吧^_^',
        icon: 'none'
      })
    }
  } else {
    //继续让用户进行授权
    this.jugdeUserLogin();
  }
},
/**
 * 保存到云数据库
 */
saveDataToServer () {
  db.collection('topicDemo').add({
    data: {
      content: that.data.content,
      date: new Date(),
      images: that.data.images,
      userInfo: that.data.userInfo,
      isLike: that.data.isLike
    },
    success: res => {
      //保存到发布历史
      that.saveToHistoryServer();
      //清空数据
      that.data.content = '';
      that.data.images = [];

      that.setData({
        content: '',
        images: []
      });
      //用户提示
      that.showTipAndSwitchTab();
    }
  });
},
/**
 * 用户提示 + 跳转至主页面
 */
  showTipAndSwitchTab () {
    wx.showToast({
      title: '新增记录成功',
      icon: 'none'
    });
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/home/home',
      });
    },500);
  },
/**
 * 保存发布历史记录
 */
  saveToHistoryServer (e) {
    db.collection('historyDemo').add({
      data: {
        content: that.data.content,
        date: new Date(),
        images: that.data.images,
        userInfo: that.userInfo,
        isLike: that.data.isLike
      },
      success: res => {
        console.log(res._id);
      },
      fail: res => {
        console.error;
      }
    });
  },

  /**
   * 预览图片
   */
  previewImg (e) {
    let index = e.currentTarget.dataset.index;

    wx.previewImage({
      current: that.data.images[index], //当前显示图片
      urls: that.data.images //所有图片
    })
  },

  /**
   * 删除图片
   */
  removeImg(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.data.images.splice(index,1); //删除数组中的元素
    this.setData({
      images: this.data.images
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //获取用户权限
    that.jugdeUserLogin();
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