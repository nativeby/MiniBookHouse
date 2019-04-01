// pages/payment/paymentHome.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    timeStamp: '',
    nonceStr: '',
    package: '',
    signType: '',
    paySign: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
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

  },

  payment: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/doPay",
      method: "GET",
      data: {
        uid: wx.getStorageSync('loginUserInfo').id
      },
      success(res) {
        console.log(res);
        if (res.data.code == 200) {

          _this.setData({
            timeStamp: res.data.data.result.timeStamp,
            nonceStr: res.data.data.result.nonceStr,
            package: res.data.data.result.package,
            signType: res.data.data.result.signType,
            paySign: res.data.data.result.sign,
          });

          wx.requestPayment({
            'timeStamp': _this.data.timeStamp,
            'nonceStr': _this.data.nonceStr,
            'package': _this.data.package,
            'signType': _this.data.signType,
            'paySign': _this.data.paySign,
            success: function(res) {
              console.log(res);
              wx.navigateBack({
                
              });
            },
            fail: function(res) {
              console.log(res);
              wx.showModal({
                title: '提示',
                content: '支付失败，请重试！'
              });
            }
          });
        }
      },
      fail: function(res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '支付失败，请重试！'
        });
      },
      complete() {
        wx.hideNavigationBarLoading();
      }
    });
  }
})