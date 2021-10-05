// pages/goods_list/index.js
import { request } from '../../request/index.js'

import refeneratorRuntime from '../../lib/runtime/runtime'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, value: '综合', isActive: true },
      { id: 1, value: '销量', isActive: false },
      { id: 2, value: '价格', isActive: false }

    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
    
  },

  // 标题的点击事件  从子组件传递
  handletabsItemChange(e) {
    console.log(e);
    /*
    获取被点击的标题索引
    修改原数组
    复制到data中
    */

    const { index } = e.detail;
    let { tabs } = this.data;

    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);

    this.setData({
      tabs
    })
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams });
    console.log(res);
    const total = res.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉的窗口
    wx.stopPullDownRefresh();
  },
  //总页数
  totalPages: 1,
  /*
      用户上滑页面  滚动条触底  开始加载下一页数据  判断是否有下一条数据 
      找到小程序触底事件(参考官方文档)
      若没有下页数据弹出提示框
      还有的话加载下页数据
    */
  // 滚动条触底事件 
  onReachBottom() {
    console.log("触底");
    // 判断是否有下页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下页数据
      wx.showToast({ title: '抱歉！没有更多商品了。。。', });
    } else {
      // 存在下页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  /*
  下拉刷新事件
  找到触发下拉刷新的事件
  触发下拉事件
  重置数据数组
  充值页码为1设置为1
  重新发送请求
  数据请求成功之后 关闭等待效果
  */

  // 下拉刷新事件
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList: []
    });
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList();
  }
})