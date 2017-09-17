//home.js
const util = require('../../utils/util.js')

Page({
  data: {
    focused: false,
    logs: []
  },
  onLoad: function () {
    this.reloadData();
  },
  reloadData: function () {
    var self = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // debug
        latitude = 30.128741;
        longitude = 120.085117;
        wx.request({
          url: "https://publictransit.dtdream.com/v1/bus/findNearbyStop?city=330100&radius=1000&lat=" + latitude + "&lng=" + longitude,
          success: function (res) {
            var stops = [];
            for (var i in res.data.items) {
              var item = res.data.items[i];
              var onestop = item.stops[0];
              var oneroute = onestop.routes[0];
              var onebus = oneroute.buses[0];
              
              var stop = {
                stopId: onestop.stop.amapId,
                stopName: item.stopName,
                userDistance: util.formatDistance(onestop ? onestop.stop.userDistance : undefined),
                routeName: oneroute.route.routeName,
                nextStation: oneroute.nextStation,
                targetDistance: util.formatDistance(onebus ? onebus.targetDistance : undefined)
              }
              stops.push(stop)
            }
            self.setData({
              stops: stops
            })
          },
          fail: function () {

          }
        })
        // wx.openLocation({
        //   latitude: latitude,
        //   longitude: longitude,
        //   scale: 28
        // })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  onPullDownRefresh: function () {
    this.reloadData();
  },
  searchFocus: function () {
    this.setData({
      focused: true
    })
  },
  searchBlur: function () {
    this.setData({
      focused: false
    })
  },
  searchConfirm: function (event) {
    this.searchText = event.detail.value;
    this.setData({})
  },
  searchClear: function (event) {
    this.setData({
      cleared: true
    })
  }
})
