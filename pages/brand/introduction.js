// pages/brand/introduction.js
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
    imageWidth: 0,
    imageHeight: 0,
    bid: "",
    brandDetail: {},
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let _this = this;

    let windowWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({
      imageWidth: windowWidth,
      imageHeight: windowWidth * (200 / 320),
      bid: options.id
    });

    this.getBrandDetailByBrandId();
    this.getGoodsListByBrandId();
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
    if (this.data.pageEnd == false) {
      this.getGoodsListByBrandId();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getBrandDetailByBrandId: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getBrandDetailByBrandId",
      method: "GET",
      data: {
        bid: _this.data.bid
      },
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data.result);

          let result = res.data.data.result;
          var pageEmpty = false;
          var pageEnd = false;

          if (result.length == 0 && _this.data.list.length == 0) {
            pageEmpty = true;
          } else if (result.length == 0) {
            pageEnd = true;
          }

          _this.setData({
            brandDetail: result,
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
  getGoodsListByBrandId: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getGoodsListByBrandId",
      method: "GET",
      data: {
        page: _this.data.pageIndex,
        bid: _this.data.bid
      },
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data.result);
          console.log(_this.data.pageIndex);

          let result = res.data.data.result;
          var page = _this.data.pageIndex;
          var pageEmpty = false;
          var pageEnd = false;

          if (result.length == 0 && _this.data.goodsList.length == 0) {
            pageEmpty = true;
          } else if (result.length > 0) {
            page = page + 1;
          } else if (result.length == 0) {
            pageEnd = true;
          }

          _this.setData({
            pageIndex: page,
            goodsList: _this.data.goodsList.concat(result),
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
  openIntroduction: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/brand/introduction?id=' + id
    });
  },
  openGoods: function(e) {
    wx.navigateTo({
      url: '/pages/details/goods?id=' + e.currentTarget.dataset.id
    });
  }
})