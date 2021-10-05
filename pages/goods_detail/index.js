// pages/goods_detail/index.js
/*
发送请求过去数据
*/
import { request } from '../../request/index.js'

import refeneratorRuntime from '../../lib/runtime/runtime'

/*
点击轮播图预览大图功能
调用小程序自身的api，previewImage
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsInfo = goodsObj;
    // console.log(res);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
        // Iphone部分手机不识别webp图片格式
        // 临时修改 确保后台存在 .webp =》.jpg

      }
    })
  },
  // 商品对象
  GoodsInfo:{},

  // 点击轮播放大预览
  handlePrevewImage(e) {
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },
  // 加入购物车 添加绑定事件 获取缓存的购物车数据 判断是否已经存在购物车++ 成功重新把购物车数组填到填充数组中
  handleCartAdd(){
    console.log(111);
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart")||[];
    //判断商品是否存在购物车中
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 不存在 
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    } else{
      // 存在 ++
      cart[index].num++;
    }
    // 重新添加缓存
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1500,
      mask: true,      
    });
      
      
  }
})