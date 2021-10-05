// pages/auth/index.js
import { request } from '../../request/index.js'
import { login } from '../../utils/asyncWx.js'
import refeneratorRuntime from '../../lib/runtime/runtime'

Page({
  async handlegetUserInfo(e) {
    // console.log(e);
    try {
      //encryptedData	rawData	iv	signature	code
      const { encryptedData, rawData, iv, signature } = e.detail;
      const { code } = await login();
      console.log(code);
      const loginParams = { encryptedData, rawData, iv, signature, code };
      const { token } = await request({ url: '/users/wxlogin', data: loginParams, methods: 'POST' });
      console.log(token);
      wx.setStorageSync("token", token);
      wx.navigateTo({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})