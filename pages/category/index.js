// pages/category/index.js
import { request } from '../../request/index.js'

import refeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftmenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容滚动条
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /*
    0.web存储和本地存储的区别 loaclStroge.setItem()//存  .....getItem()//拿-----web
     wx.setStorageSync("cates", {"key","value");   wx.getStorageSync("key")
     存的时候有没有类型转换 web--不管存入什么类型的数据，都会先调用toString，把数据变成字符串再存入数据
     小程序---不存在类型转换的操作---存什么类型的拿的就是什么类型
    1.判断本地存储中有没有旧的数据
    {{time:Date.now(),data:[....]}}//格式
    2.有不管----没有重新发送请求
    3.有旧的数据  同时没有过期  可以使用本地存储的旧数据
    */
    //获取本地存储的数据
    const Cates = wx.getStorageSync("cates");
    // 开始判断本地存储
    if (!Cates) {
      this.getCates();

    } else {
      // 有旧的数据  自定过期时间 2m
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        //重新发送请求
        this.getCates();
      } else {
        console.log('使用旧数据');
        this.Cates = Cates.data;
        // 构造左侧菜单数据
        let leftmenuList = this.Cates.map(v => v.cat_name);
        //构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftmenuList,
          rightContent
        });
      }

    }
  },

  // 获取分类数据
  async getCates() {
    // request({ url: '/categories' }).then(res => {
    //   console.log(res)
    //   this.Cates = res.data.message;

    //   // 把接口的数据存入本地
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //   // 构造左侧菜单数据
    //   let leftmenuList = this.Cates.map(v => v.cat_name);
    //   //构造右侧商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftmenuList,
    //     rightContent
    //   })
    // })
    /*
    使用es7的async await 发送请求
    */

    const res = await request({ url: '/categories' });
    // this.Cates = res.data.message;

    this.Cates = res;
    // 把接口的数据存入本地
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    // 构造左侧菜单数据
    let leftmenuList = this.Cates.map(v => v.cat_name);
    //构造右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftmenuList,
      rightContent
    })
  },

// 左侧菜单的点击事件
handleItemTap(e) {
  console.log(e);
  /*  
  1.获取被点击事件的索引
  2.data中的currentIndex赋值就ok
  3.根据不同的索引渲染右侧是商品
  */
  const { index } = e.currentTarget.dataset;
  let rightContent = this.Cates[index].children;
  this.setData({
    currentIndex: index,
    rightContent,
    // 重新设置右侧内容的scoll-top的距离
    scrollTop: 0
  })

}
})