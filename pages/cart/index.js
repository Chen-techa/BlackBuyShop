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
    allCheck: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 获取缓存的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    /*
    计算全选 every方法 遍历 会接受一个回调函数 则每一个返回值都为true 则every返回true
    有一个回调函数返回false则不再循环执行，直接返回false
    空数组调用了every返回值为true
    */
    //  const allCheck = cart.length?cart.every(v=>v.checked):false;
    this.setCart(cart);
    this.setData({ address });
  },
  // 获取用户的收货地址
  /*
    绑定点击事件
    调用内置的api   wx.chooseAddress
    获取user当前对小程序的权限 scope
  */
  async handleChooseAddress() {
    try {
      // wx.getSetting({
      //   success: (res) => {
      //     const scopeAddress = res.authSetting["scope.address"];
      //     if(scopeAddress===true||scopeAddress===undefined){
      //       wx.chooseAddress({
      //         success: (result) => {
      //           console.log(result);
      //         }
      //       });            
      //     }else{
      //       wx.openSetting({
      //         success: (rest) => {
      //           wx.chooseAddress({
      //             success: (resu) => {

      //             }
      //           });    
      //         }
      //       });

      //     }
      //   }      
      // });
      // 获取收货地址
      const res = await getSetting();
      const scopeAddress = res.authSetting["scope.address"];
      // 判断权限状态
      if (scopeAddress === false) {
        // 调用收获地址的api
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      wx.setStorageSync("address", address);

    }
    catch (error) {
      console.log(error);
    }
  },
  /*
  全选数据
  onShow获取缓存中的购物车数组
  根据购物车商品的数据  所有的商品都被选中的时候就全选
  */

  /*
  选中功能
  */
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  setCart(cart) {

    let allCheck = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allCheck = false;
      }
    })
    // 判断数组是否为空
    allCheck = cart.length != 0 ? allCheck : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allCheck
    });
    wx.setStorageSync("cart", cart);
  },
  // 全反选
  handleItemAllCheck() {
    let { cart, allCheck } = this.data;
    allCheck = !allCheck;
    cart.forEach(v => v.checked = allCheck);
    this.setCart(cart)
  },
  async handleItemNumEdit(e) {
    const { operation, id } = e.currentTarget.dataset;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否要删除该商品',
      //   success: (res) => {
      //     if (res.confirm) {
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     } else if (res.cancel) {
      //       console.log("用户不删除");
      //     }
      //   }
      // });
      const res = await showModel({ content: '您是否要删除该商品?' });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      } 
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  async handlePay(){
    const {address,totalNum} = this.data;
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'});
      return;
    }
    if (totalNum==0) {
      await showToast({title:'请先选购商品'});
      return;
    }
    wx.navigateTo({
      url: '../../pages/pay/index',      
    });
      
  }
})