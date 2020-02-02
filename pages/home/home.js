// pages/home/home.js
let that;
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: [],
    totalCount: 0, //数据总数
    currentPage: 1, //当前显示的是第几页的数据
    pageNum: 4 //每次从数据库当中获取几条数据
  },
  /**
   * 获取数据
   * （小程序规定，每次从数据库获取20条数据）
   */
  getData () {
    db.collection('topicDemo').orderBy('date','desc').limit(that.data.pageNum).get({
      success: res => {
        res.data.map((item,index,array) => {
          item.date = String(item.date); //将获取到的时间转化为字符串
        });
        that.data.topic = res.data;
        that.setData({
          topic: that.data.topic
        });
        wx.hideNavigationBarLoading(); //隐藏标题栏loading
        //终止下拉刷新动作
        wx.stopPullDownRefresh();
      },
      fail: res => {
        wx.hideNavigationBarLoading(); //隐藏标题栏loading
        //终止下拉刷新动作
        wx.stopPullDownRefresh();
      }
    });
  },
/**
 * 获取记录总数
 */
  getDataCount () {
    db.collection('topicDemo').where({
      _openid: app.globalData.openId
    }).count({
      success: res => {
        // res.total
        that.data.totalCount = res.total;
      },
      fail: console.error
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
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
    that.getData();
    this.getDataCount();
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
    // 加载标题栏的loading动作
    wx.showNavigationBarLoading();
    that.getData(); //重新获取最新数据
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载数据'
    });
    let temp = [];
    //如果拿过的数据数量依然小于数据库内的总量，继续获取数据
    if (this.data.topic.length < this.data.totalCount) {
      //跳过之前的那个数据，继续从数据库取值
      db.collection('topicDemo').orderBy('date', 'desc').skip(that.data.pageNum * that.data.currentPage).get({
        success: res => {
          if (res.data.length > 0) {
            wx.hideLoading();
            for (let i = 0 ; i < res.data.length ; i ++) {
              let tempTopic = res.data[i];
              temp.push(tempTopic);
            }
            let totalTopic = {};
            totalTopic = that.data.topic.concat(temp);
            that.setData({
              topic: totalTopic
            });
          }
          //当前页+1
          that.data.currentPage ++;
        },
        fail: console.error
      });
    } else {
      wx.showToast({
        title: '我也是有底线的，喵~',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})