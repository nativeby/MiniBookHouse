// pages/detail/suit.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight: 0,
    pageBottom: app.globalData.pageBottom,
    suitID: "",
    summary: {},
    goodsCount: 0,
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let _this = this;
    let query = wx.createSelectorQuery();
    query.selectAll('.box-top').boundingClientRect(rect => {
      let heightAll = 0;
      rect.map((currentValue, index, arr) => {
        heightAll = heightAll + currentValue.height
      });

      _this.setData({
        scrollViewHeight: app.globalData.windowHeight - heightAll
      });

    }).exec();
    this.setData({
      suitID: options.id,
    });

    wx.request({
      url: app.globalData.baseApi + "outer/getSuitDetailById",
      method: "GET",
      data: {
        id: _this.data.suitID
      }, // 这里换成动态参数
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data);

          _this.setData({
            summary: res.data.data.result.summary,
            goodsCount: res.data.data.result.count,
            goodsList: res.data.data.result.list
          })
        }
      }
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

  openGoods: function(e) {
    wx.navigateTo({
      url: '/pages/details/goods?id=' + e.currentTarget.dataset.id
    });
  },

  openBox: function() {
    wx.switchTab({
      url: '/pages/cart/box'
    });
  },

  addToBox: function(e) {
    app.globalData.reloadBox = true;
    app.globalData.box.push(e.currentTarget.dataset.id);
    wx.setStorageSync('box', app.globalData.box);
    wx.showToast({
      title: '已加入书包'
    });
  }
})