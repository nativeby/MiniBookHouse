//app.js
App({
  globalData: {
    baseApi: "https://xxc.hunli.baihe.com/",
    authorize: true,
    cartList: [],
    cartNum: 0,
    session: "",
    userInfo: {},
    loginUserInfo: {},
    isIPhoneX: false,
    windowWidth: 0,
    windowHeight: 0,
    scrollViewHeight: 0,
    pageBottom: 30,
    categoryFilter: {},
    box: [],
    reloadBox: true,
    selectedAddress: {
      id: "",
      name: "",
      address: "",
      biztime: "",
    }
  },

  onLaunch: function() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {

        _this.globalData.windowWidth = res.windowWidth;
        _this.globalData.windowHeight = res.windowHeight;

        //model中包含着设备信息
        var model = res.model
        if (model.search('iPhone X') != -1) {
          _this.globalData.isIPhoneX = true;
          _this.globalData.pageBottom = 68
        } else {
          _this.globalData.isIPhoneX = false;
          _this.globalData.pageBottom = 0
        }
      }
    });

    let box = wx.getStorageSync('box');
    if (box.length > 0) {
      _this.globalData.box = box;
    }
  },

  checkSession: function() {
    let _this = this;

    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        console.log('session_key 未过期，并且在本生命周期一直有效');
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log('session_key 已经失效，需要重新执行登录流程');

        // 重新登录
        wx.redirectTo({
          url: '/pages/authorize'
        })
      }
    });
  }
  
});