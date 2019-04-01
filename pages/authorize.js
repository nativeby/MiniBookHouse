// pages/authorize.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getUserInfo: function() {
    let _this = this;
    wx.getUserInfo({
      success(res) {
        app.globalData.userInfo = res.userInfo;

        console.log(app.globalData.userInfo);

        _this.login();
      }
    })
  },

  login: function() {
    let _this = this;
    wx.showNavigationBarLoading();

    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: app.globalData.baseApi + "outer/login",
            method: "GET",
            data: {
              code: res.code,
              nickname: app.globalData.userInfo.nickName,
              avatar: app.globalData.userInfo.avatarUrl
            },
            success(res) {
              if (res.data.code == 200) {
                app.globalData.loginUserInfo = res.data.data.result;

                console.log('登录成功！')
                console.log(app.globalData.loginUserInfo);

                wx.setStorageSync('userInfo', app.globalData.userInfo);
                wx.setStorageSync('loginUserInfo', app.globalData.loginUserInfo);

                wx.switchTab({
                  url: '/pages/home'
                })
              }
            },
            complete() {
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  }
})