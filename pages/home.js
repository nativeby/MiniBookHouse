// pages/home.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize: app.globalData.authorize,
    scrollViewHeight: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imageHeight: 0,
    page: 1,
    slideshow: [],
    age: [],
    brand: [],
    goods: [],
    suitGoodsList: [],
    hotGoodsList: [],
    newGoodsList: [],
    bestGoodsList: []
  },

  getSetting: function() {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          app.globalData.authorize = true;
        } else {
          console.log('未授权');
          app.globalData.authorize = false;

          wx.redirectTo({
            url: '/pages/authorize'
          })
        }
      }
    });
  },

  imageLoad: function(e) {
    let windowWidth = wx.getSystemInfoSync().windowWidth;
    let width = e.detail.width;
    let height = e.detail.height;
    this.setData({
      imageHeight: windowWidth * height / width,
    });
  },

  openMoreList: function(e) {
    var comType = e.currentTarget.dataset.comtype;
    wx.navigateTo({
      url: '/pages/normalSectionList?comType=' + comType
    });
  },

  openPolymerization: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/brand/polymerization?id=' + id
    });
  },
  openCategory: function(e) {

    let pid = e.currentTarget.dataset.pid;
    let cid = e.currentTarget.dataset.id;
    let index = parseInt(e.currentTarget.dataset.index) + 1;

    console.log(index);

    app.globalData.categoryFilter = {
      currentTarget: {
        dataset: {
          id: cid,
          index: index,
          pid: pid
        }
      }
    }

    wx.switchTab({
      url: '/pages/category'
    });
  },

  openSuit: function(e) {
    wx.navigateTo({
      url: '/pages/details/suit?id=' + e.currentTarget.dataset.id
    });
  },

  openGoods: function(e) {

    let url = '';
    if (e.currentTarget.dataset.issuit == '1') {
      url = '/pages/details/suit?id=' + e.currentTarget.dataset.id;
    } else {
      url = '/pages/details/goods?id=' + e.currentTarget.dataset.id;
    }

    wx.navigateTo({
      url: url
    });
  },

  getSlideshow: function() {
    let _this = this;
    wx.request({
      url: app.globalData.baseApi + "outer/getHomeBannerList",
      method: "GET",
      success(res) {
        if (res.data.code == 200) {
          _this.setData({
            slideshow: res.data.data.result,
          });
        }
      }
    });
  },

  getCategoryList: function() {
    let _this = this;
    wx.request({
      url: app.globalData.baseApi + "outer/getHomeCategoryList",
      method: "GET",
      success(res) {
        if (res.data.code == 200) {
          // console.log(res.data);
          _this.setData({
            age: res.data.data.result.age,
            brand: res.data.data.result.brand,
            goods: res.data.data.result.goods
          });
        }
      }
    });
  },

  getGoodsList: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getHomeGoodsList",
      method: "GET",
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data.result);

          _this.setData({
            suitGoodsList: res.data.data.result.suit,
            hotGoodsList: res.data.data.result.hot,
            newGoodsList: res.data.data.result.new,
            bestGoodsList: res.data.data.result.best,
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
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
        scrollViewHeight: app.globalData.windowHeight - heightAll - (app.globalData.windowWidth / 750 * 115)
      });

    }).exec();

    this.getSlideshow();
    this.getCategoryList();
    this.getGoodsList();

    this.getSetting();
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
      page: 1,
    });

    this.getSlideshow();
    this.getCategoryList();
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("上拉");
    //this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindKeyConfirm(e) {
    wx.navigateTo({
      url: '/pages/search/search?keyword=' + e.detail.value
    })
  }
});