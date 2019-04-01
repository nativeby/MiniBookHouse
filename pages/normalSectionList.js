// pages/normalSectionList.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageBottom: app.globalData.pageBottom,
    pageIndex: 1,
    comType: '',
    pageEnd: false,
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      comType: options.comType,
    });

    var sectionTitle = '';

    if (this.data.comType == 'suit') {
      sectionTitle = '套装推荐';
    } else if (this.data.comType == 'hot') {
      sectionTitle = '热门图书';
    } else if (this.data.comType == 'new') {
      sectionTitle = '新到图书';
    } else if (this.data.comType == 'best') {
      sectionTitle = '精品推荐'
    }

    wx.setNavigationBarTitle({
      title: sectionTitle
    });

    this.getGoodsList();
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

    this.setData({
      pageIndex: 1,
      goodsList: [],
      pageEnd: false
    });

    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getGoodsList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  openThis: function(e) {
    if (this.data.comType == 'suit') {
      wx.navigateTo({
        url: '/pages/details/suit?id=' + e.currentTarget.dataset.id
      })
    } else {
      wx.navigateTo({
        url: '/pages/details/goods?id=' + e.currentTarget.dataset.id
      })
    }
  },

  getGoodsList: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getGoodsListByCommendType",
      method: "GET",
      data: {
        page: _this.data.pageIndex,
        comType: _this.data.comType
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data);

          let result = res.data.data.result;
          var page = _this.data.pageIndex;
          var pageEnd = true;

          if (result.length > 0) {
            page = page + 1;
            pageEnd = false;
          }

          _this.setData({
            pageIndex: page,
            goodsList: _this.data.goodsList.concat(result),
            pageEnd: pageEnd
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  }
})