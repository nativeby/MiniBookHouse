// pages/user.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.authorize) {
      app.checkSession();
    }

    let uid = wx.getStorageSync('loginUserInfo').id;
    if (!uid || uid.length == 0) {
      wx.redirectTo({
        url: '/pages/authorize'
      })

      return;
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  openOrrowingOrder: function(e) {
    wx.navigateTo({
      url: '/pages/order/orrowingOrder'
    });
  },

  openReturnOrder: function(e) {
    wx.navigateTo({
      url: '/pages/order/returnOrder'
    });
  },

  openMyMember: function(e) {
    // wx.navigateTo({
    //   url: '/pages/order/orrowingOrder'
    // });
  },

  call: function(e) {
    wx.navigateTo({
      url: '/pages/common/contactInfo'
    });
  }

});