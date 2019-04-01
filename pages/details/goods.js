// pages/detail/goods.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight: 0,
    pageBottom: app.globalData.pageBottom,
    goodsID: "",
    goodsInfo: {}
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
      goodsID: options.id,
    });

    wx.request({
      url: app.globalData.baseApi + "outer/getGoodsDetailById",
      method: "GET",
      data: {
        id: _this.data.goodsID
      },
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data.result);

          _this.setData({
            goodsInfo: res.data.data.result
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

  openBox: function() {
    wx.switchTab({
      url: '/pages/cart/box'
    });
  },

  addToBox: function() {
    app.globalData.reloadBox = true;
    app.globalData.box.push(this.data.goodsID);
    wx.setStorageSync('box', app.globalData.box);
    wx.showToast({
      title: '已加入书包'
    });
  }
})