// pages/cart/index.js
import { request } from '../../request/index.js'
import { getSetting, chooseAddress, openSetting, showModel ,showToast} from '../../utils/asyncWx.js'
import refeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],

    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 获取缓存的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    /*
    计算全选 every方法 遍历 会接受一个回调函数 则每一个返回值都为true 则every返回true
    有一个回调函数返回false则不再循环执行，直接返回false
    空数组调用了every返回值为true
    */
    //  const allCheck = cart.length?cart.every(v=>v.checked):false;
    cart = cart.filter(v=>v.checked);
    this.setData({ address });
    // this.setCart(checkedCart);
    let allCheck = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  handleOrderPay(){
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    const header = {Authorization:token};
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.add;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderParams = {order_price,consignee_addr,goods};
    // const res = await request({url:'/my/orders/create',methods:'POST',data:orderParams,header:header});
    console.log(res);
  }
})