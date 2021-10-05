//Page Object
//引入用来发送请求的方法(一定要补全路径)
import {request} from '../../request/index.js'
Page({
  data: {
    //轮播图数组
    swiperList:[],
    // 导航栏数组
    catesList:[],
    // 楼层数据
    floorList:[],
  },
  //options(Object)
  // 页面开始加载的时候会触发
  onLoad: function(options) {
    //发送轮播图的异步请求
    //异步请求的优化 ----Promise
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   dataType:'json',//返回值类型
    //   success:(res)=>{
    //     console.log(res)
    //     this.setData({ 
    //       swiperList:res.data.message
    //     }) 
    //   } 
    // })
    this.getSwiperList();
    this.getCatesList();
    this.getfloorList();
  }, 
  //获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"}).then(res=>{
      console.log(res)
      this.setData({
        swiperList:res
      })
    })
  },
  //获取分类数据
  getCatesList(){
    request({url:"/home/catitems"}).then(res=>{
      console.log(res)
      this.setData({
        catesList:res
      })
    })
  },
  // 获取楼层数据展示
  getfloorList(){
    request({url:"/home/floordata"}).then(res=>{
      console.log(res)
      this.setData({
        floorList:res
      })
    })
  }
});
  