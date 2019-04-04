// pages/cart/box.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight: 0,
    pageBottom: app.globalData.pageBottom,
    pageEmpty: false,
    selectedAddress: {
      id: '',
      name: '',
    },
    boxList: [],
    selectedBoxList: [],
    selectedIndexList: [],
    selectedCount: 0,
    selectedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let query = wx.createSelectorQuery();
    query.selectAll('.box-top').boundingClientRect(rect => {
      let heightAll = 0;
      rect.map((currentValue, index, arr) => {
        heightAll = heightAll + currentValue.height
      });

      _this.setData({
        scrollViewHeight: app.globalData.windowHeight - heightAll - (80 / 750 * app.globalData.windowWidth)
      });

    }).exec();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;

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

    _this.setData({
      selectedAddress: app.globalData.selectedAddress
    });

    if (app.globalData.reloadReturnBox) {
      this.getPendingReturnBooks();
      app.globalData.reloadReturnBox = false;
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  selectAddress: function (e) {
    wx.navigateTo({
      url: '/pages/cart/address?from=return'
    })
  },

  getPendingReturnBooks: function () {

    let _this = this;
    let uid = wx.getStorageSync('loginUserInfo').id;

    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getPendingReturnBooks",
      method: "GET",
      data: {
        uid: uid
      },
      success(res) {
        if (res.data.code == 200) {

          var result = res.data.data.result;

          if (result.length == 0 && _this.data.takeSelfList.length == 0) {
            pageEmpty = true;
          }

          for (let i = 0; i < result.length; i++) {
            result[i].selected = false;
          }

          _this.setData({
            boxList: result,
            selectedCount: 0,
            selectedAll: false,
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  selectBook: function (e) {
    let bookIndex = e.currentTarget.dataset.index;
    var s = this.data.boxList[bookIndex].selected;
    s = !s;

    if (s == true && this.data.selectedCount < this.data.boxList.length) {
      this.data.selectedCount += 1;
    } else if (this.data.selectedCount > 0) {
      this.data.selectedCount -= 1;
    }

    var selectedAll = false;
    if (this.data.selectedCount == this.data.boxList.length) {
      selectedAll = true;
    }

    var selected = "boxList[" + bookIndex + "].selected";

    console.log(selected);

    this.setData({
      [selected]: s,
      selectedCount: this.data.selectedCount,
      selectedAll: selectedAll,
    });

  },

  selectAllBook: function (e) {
    let selected = !this.data.selectedAll;
    var boxList = this.data.boxList;
    for (let i = 0; i < boxList.length; i++) {
      boxList[i].selected = selected;
    }

    var selectedCount = 0;
    if (selected) {
      selectedCount = this.data.boxList.length;
    }

    this.setData({
      boxList: boxList,
      selectedCount: selectedCount,
      selectedAll: selected,
    });
  },

  createReturnOrder: function (e) {
    let _this = this;

    _this.data.selectedBoxList = [];
    _this.data.selectedIndexList = [];

    let uid = wx.getStorageSync('loginUserInfo').id;
    if (uid.length == 0) {
      wx.redirectTo({
        url: '/pages/authorize'
      })

      return;
    }

    let aid = _this.data.selectedAddress.id;
    if (aid.length == 0) {
      wx.showToast({
        title: '请选择地址~',
        icon: 'none'
      });

      return;
    }

    if (_this.data.selectedCount == 0) {
      wx.showToast({
        title: '请至少选择1本图书~',
        icon: 'none'
      });
      return;
    }

    for (let i = 0; i < _this.data.boxList.length; i++) {
      if (_this.data.boxList[i].selected) {
        let ogObj = {
          id: _this.data.boxList[i].id,
          order_id: _this.data.boxList[i].order_id,
          goods_id: _this.data.boxList[i].goods_id
        }
        _this.data.selectedBoxList.push(ogObj);
        // _this.data.selectedBoxList.push(_this.data.boxList[i]);
        _this.data.selectedIndexList.push(i);
      }
    }

    let ogids = [];
    for (let i = 0; i < _this.data.selectedBoxList.length; i++){
      ogids.push(_this.data.selectedBoxList[i])
    }

    console.log(ogids);
    if (ogids.length == 0) {
      wx.showToast({
        title: '请重新选择图书~',
        icon: 'none'
      });
      return;
    }

    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/createReturnOrder",
      method: "GET",
      data: {
        uid: uid,
        aid: aid,
        ogids: ogids
      },
      success(res) {

        if (res.data.code == 200) {
          for (let i = 0; i < _this.data.selectedBoxList.length; i++) {
            let index = _this.data.selectedIndexList[i];

            _this.data.boxList.splice(index-i, 1); // 索引不停变
            _this.data.selectedCount -= 1;

          }

          _this.setData({
            selectedCount: _this.data.selectedCount,
            boxList: _this.data.boxList
          });

          wx.showToast({
            title: '还书订单已提交~'
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }
      },
      fail(res) {
        console.log(res);
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });

  }

})