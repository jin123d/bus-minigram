// pages/map.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    var stops = [];
    var currentStop;
    for (var item of app.stops) {
      var size = 16
      var iconPath = '/resources/stop.png'
      if (item == app.stops[0]) {
        iconPath = '/resources/begin.png'
        size = 20
      } else if (item == app.stops[app.stops.length - 1]) {
        iconPath = '/resources/end.png'
        size = 20
      }
      if (item.stopId == options.stopId) {
        currentStop = item;
      }
      stops.push({
        id: item.stopId,
        iconPath: iconPath,
        latitude: item.latitude,
        longitude: item.longitude,
        color: "#1e82d2FF",
        fillColor: "#FFFFFFFF",
        width: size,
        height: size,
        anchor: {
          x: 0.5,
          y: 0.5
        },
        callout: currentStop == item? {
          display: 'ALWAYS',
          content: item.stopName,
          fontSize: "14px",
          borderRadius: 8,
          padding: "8px"
        } : undefined
      })
    }
    var self = this;
    self.setData({
      latitude: currentStop.latitude,
      longitude: currentStop.longitude
    })
    this.routeId = options["routeId"];
    wx.request({
      url: 'https://restapi.amap.com/v3/bus/lineid?key=248138cabdb96b4743038bcad349b000&output=json&city=%E6%9D%AD%E5%B7%9E&id=' + this.routeId,
      success: function (res) {
        var busline = res.data.buslines[0];
        if (!busline) {
          wx.showToast({
            image: "/resources/error-empty.png",
            title: '未找到线路',
          })
          return;
        }
        var points = []
        for (var item of busline.polyline.split(";")) {
          var latlng = item.split(',')
          points.push({
            longitude: Number(latlng[0]),
            latitude: Number(latlng[1])
          })
        }
        self.setData({
          polyline: [{
            points: points,
            color: "#1e82d2FF",
            width: 6,
            arrowLine: true
          }],
          markers: stops
        })
      },
      fail: function (res) {
        wx.showToast({
          image: "/resources/error-network.png",
          title: '请求失败请重试',
        })
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
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
  
  }
})