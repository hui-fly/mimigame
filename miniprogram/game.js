// const canvas = wx.createCanvas()
// const context = canvas.getContext('2d') // 创建一个 2d context
// context.fillStyle = '#1aad19' // 矩形颜色
//     // context.fillRect(0, 0, 100, 100) // 矩形左上角顶点为(0, 0)，右下角顶点为(100, 100)
// const { windowWidth, windowHeight } = wx.getSystemInfoSync()

// function drawRect(x, y) {
//     context.clearRect(0, 0, windowWidth, windowHeight)
//     context.fillRect(x, y, 100, 100)
// }
// let rectY = 0
// let rectX = canvas.width / 2 - 50
// drawRect(rectX, rectY++)
// let button = wx.createUserInfoButton({
//     type: 'text',
//     text: '获取用户信息',
//     style: {
//         left: 10,
//         width: 200,
//         height: 40,
//         lineHeight: 40,
//         backgroundColor: '#ff0000',
//         color: '#ffffff',
//         textAlign: 'center',
//         fontSize: 16,
//         borderRadius: 4
//     }
// })
// wx.openSetting({
//     success(res) {
//         console.log(res.authSetting)
//             // res.authSetting = {
//             //   "scope.userInfo": true,
//             //   "scope.userLocation": true
//             // }
//     }
// })
// button.onTap((res) => {
//     console.log(res)
// })
// wx.getSetting({
//     success(res) {
//         if (!res.authSetting['scope.userinfo']) {
//             wx.authorize({
//                 scope: 'scope.userinfo',
//                 success() {
//                     // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
//                     wx.openSetting({
//                         success(res) {
//                             console.log(res.authSetting)
//                         }
//                     })
//                 },
//                 fail() {
//                     // console.log(scope)
//                 }
//             })
//         }
//     }
// })
// wx.getSetting({
//     success(res) {
//         console.log(res.authSetting)
//             // res.authSetting = {
//             //   "scope.userInfo": true,
//             //   "scope.userLocation": true
//             // }
//     }
// })
// wx.getUserInfo({
//     success(res) {
//         console.log(res)
//     }
// })

// function ani() {
//     drawRect(rectX, rectY++)
//         // requestAnimationFrame(ani)
// }
// let aniId = setInterval(ani,16)
// let image = wx.createImage()
// const imgX = canvas.width / 2 - 50
// let imgY = 400
// image.onload = function () {
//   console.log(image)
//   context.drawImage(image, imgX, imgY)
// }
// image.src = './images/hero.png'
// let touchX = imgX
// let touchY = imgY
// wx.onTouchMove(function(res) {
//   context.clearRect(touchX,touchY,100,100)
//   touchX = res.changedTouches[0].clientX
//   touchY = res.changedTouches[0].clientY
//   context.drawImage(image, touchX, touchY)
//   if (touchX >= rectX - 100 && touchX <= rectX + 100 && touchY >= rectY - 100 && touchY <= rectY + 100) { // 飞机与矩形发生碰撞
//     wx.showModal({
//       title: '提示',
//       content: '发生碰撞，游戏结束！'
//     })
//   }
// })


import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'

new Main()