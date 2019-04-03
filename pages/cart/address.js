// pages/cart/address.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageBottom: app.globalData.pageBottom,
    pageIndex: 1,
    pageEmpty: false,
    pageEnd: false,
    takeSelfList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTakeSelfList();
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

  getTakeSelfList: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getTakeSelfList",
      method: "GET",
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data.result);

          let result = res.data.data.result;
          var page = _this.data.pageIndex;
          var pageEmpty = false;
          var pageEnd = false;

          if (result.length == 0 && _this.data.takeSelfList.length == 0) {
            pageEmpty = true;
          } else if (result.length > 0) {
            page = page + 1;
          } else if (result.length == 0) {
            pageEnd = true;
          }

          _this.setData({
            pageIndex: page,
            takeSelfList: result,
            pageEmpty: pageEmpty,
            pageEnd: pageEnd
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  selectAddress: function(e) {
    app.globalData.selectedAddress.id = e.currentTarget.dataset.id;
    app.globalData.selectedAddress.name = e.currentTarget.dataset.name;
    app.globalData.selectedAddress.bizTime = e.currentTarget.dataset.biztime;
    app.globalData.selectedAddress.address = e.currentTarget.dataset.address;

    wx.navigateBack({
      
    })
  }
})