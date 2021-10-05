// 同时发送异步代码的次数
let ajaxtimes = 0;
export const request = (params) => {
    ajaxtimes++;
    // 显示加载中的效果
    wx.showLoading({
        title: '加载中',
        mask: true
    })

    // 定义公共url
    const baserUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
    return new Promise((resolve, reject) => {
        var reqTask = wx.request({
            ...params,
            // 结构url 重新拼接完成api接口
            url: baserUrl + params.url,
            success: (res) => {
                resolve(res.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                // setTimeout(function () {
                ajaxtimes--;
                if (ajaxtimes === 0)
                    wx.hideLoading()
                //   }, 2000)  
            }
        });

    })
}