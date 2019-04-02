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
    level: 'joinMembership',
    maxBorrowBooks: 5,
    isValid: 0,
    vipDateFrom: '',
    vipDateTo: '',
    selectedAddress: {
      id: '',
      name: '',
      address: '',
      biztime: '',
    },
    boxList: [],
    selectedBoxList: [],
    selectedIndexList: [],
    selectedCount: 0,
    selectedAll: false,
    totalPrice: 0
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
        scrollViewHeight: app.globalData.windowHeight - heightAll - (80 / 750 * app.globalData.windowWidth)
      });

    }).exec();
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

    this.getVipInfo();

    if (app.globalData.reloadBox) {
      let box = wx.getStorageSync('box');

      if (box.length > 0) {

        box.forEach(function(value, index, arrSelf) {
          if (app.globalData.box.indexOf(value) < 0) {
            app.globalData.box.push(value);
          }
        });

        console.log(app.globalData.box);

        this.getGoodsSummaryByIds();
      }

      app.globalData.reloadBox = false;
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

  selectAddress: function(e) {
    wx.navigateTo({
      url: '/pages/cart/address'
    })
  },

  getVipInfo: function() {
    let _this = this;
    let uid = wx.getStorageSync('loginUserInfo').id;

    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getVipInfo",
      method: "GET",
      data: {
        uid: uid
      },
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data.result);

          _this.setData({
            level: res.data.data.result.level,
            maxBorrowBooks: res.data.data.result.max_borrow_books,
            isValid: res.data.data.result.is_valid,
            vipDateFrom: res.data.data.result.vip_date_from,
            vipDateTo: res.data.data.result.vip_date_to
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  getGoodsSummaryByIds: function() {
    let _this = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/getGoodsSummaryByIds",
      method: "GET",
      data: {
        ids: app.globalData.box.toString()
      },
      success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data.result);

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
            totalPrice: 0
          });
        }
      },
      complete() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  selectBook: function(e) {
    let bookIndex = e.currentTarget.dataset.index;
    var s = this.data.boxList[bookIndex].selected;
    s = !s;

    let price = parseFloat(this.data.boxList[bookIndex].sell_price);
    var totalPrice = parseFloat(this.data.totalPrice);

    if (s == true && this.data.selectedCount < this.data.boxList.length) {
      this.data.selectedCount += 1;
      totalPrice += price;
    } else if (this.data.selectedCount > 0) {
      this.data.selectedCount -= 1;
      totalPrice -= price;
    }

    totalPrice = totalPrice.toFixed(2);

    var selectedAll = false;
    if (this.data.selectedCount == this.data.boxList.length) {
      selectedAll = true;
    }


    console.log(this.data.selectedCount);
    console.log(price);

    var selected = "boxList[" + bookIndex + "].selected";

    this.setData({
      [selected]: s,
      selectedCount: this.data.selectedCount,
      selectedAll: selectedAll,
      totalPrice: totalPrice
    });

  },

  selectAllBook: function(e) {
    let selected = !this.data.selectedAll;
    var boxList = this.data.boxList;
    var totalPrice = parseFloat(0);
    for (let i = 0; i < boxList.length; i++) {
      boxList[i].selected = selected;

      if (selected) {
        totalPrice += parseFloat(boxList[i].sell_price);
      }
    }

    totalPrice = totalPrice.toFixed(2);

    var selectedCount = 0;
    if (selected) {
      selectedCount = this.data.boxList.length;
    }

    this.setData({
      boxList: boxList,
      selectedCount: selectedCount,
      selectedAll: selected,
      totalPrice: totalPrice
    });
  },

  deleteBook: function(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let bookIndex = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要从书包删除吗？',
      success: function(res) {
        if (res.confirm) {
          let index = app.globalData.box.indexOf(id);
          console.log(index);

          app.globalData.box.splice(index, 1);

          wx.setStorageSync('box', app.globalData.box);

          var boxList = _this.data.boxList;
          boxList.splice(bookIndex, 1);

          var totalPrice = parseFloat(0);
          var selectedCount = 0;
          var selected = false;

          for (let i = 0; i < boxList.length; i++) {
            if (boxList[i].selected) {
              selectedCount = selectedCount + 1;
              totalPrice += parseFloat(boxList[i].sell_price);
            }
          }

          totalPrice = totalPrice.toFixed(2);
          if (selectedCount == boxList.length) {
            selected = true;
          }

          _this.setData({
            boxList: boxList,
            selectedCount: selectedCount,
            selectedAll: selected,
            totalPrice: totalPrice
          });
        }
      }
    });
  },

  payment: function(e) {
    wx.navigateTo({
      url: '/pages/payment/paymentHome',
    });
  },

  createOrder: function(e) {
    let _this = this;

    _this.data.selectedBoxList = [];
    _this.data.selectedIndexList = [];

    let uid = wx.getStorageSync('loginUserInfo').id;
    let aid = _this.data.selectedAddress.id;

    if (_this.data.level == 'joinMembership' || _this.data.isValid == 0) {
      wx.navigateTo({
        url: '/pages/payment/paymentHome',
      });

      return;
    }

    if (uid.length == 0) {
      wx.redirectTo({
        url: '/pages/authorize'
      })

      return;
    }

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
    
    if (_this.data.selectedCount > _this.data.maxBorrowBooks) {
      let count = _this.data.maxBorrowBooks;
      wx.showToast({
        title: '最多选择' + count + '本图书~',
        icon: 'none'
      });
      return;
    } 
    
    for (let i = 0; i < _this.data.boxList.length; i++) {
      if (_this.data.boxList[i].selected) {
        _this.data.selectedBoxList.push(_this.data.boxList[i].id);
        _this.data.selectedIndexList.push(i);
      }
    }

    let gid = _this.data.selectedBoxList.toString();

    if (gid.length == 0) {
      wx.showToast({
        title: '请重新选择图书~',
        icon: 'none'
      });
      return;
    }

    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseApi + "outer/createOrder",
      method: "GET",
      data: {
        uid: uid,
        aid: aid,
        gid: gid
      },
      success(res) {

        var boxList = _this.data.boxList;
        if (res.data.code == 200) {
          for (let i = 0; i < _this.data.selectedBoxList.length; i++) {
            let id = _this.data.selectedBoxList[i];
            let index = app.globalData.box.indexOf(id);

            app.globalData.box.splice(index, 1);

            wx.setStorageSync('box', app.globalData.box);

            _this.data.selectedCount -= 1;
          }

          var newBoxList = [];
          for (let i = 0; i < app.globalData.box.length; i++) {
            for (let j = 0; j < boxList.length; j++) {
              if (app.globalData.box[i] == boxList[j].id) {
                newBoxList.push(boxList[j]);
              }
            }
          }

          _this.setData({
            selectedCount: _this.data.selectedCount,
            boxList: newBoxList
          });

          wx.showToast({
            title: '订单已提交~'
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