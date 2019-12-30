import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

let ctx = canvas.getContext('2d')
let databus = new DataBus()

wx.cloud.init({
    // env 参数说明：
    //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
    //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
    //   如不填则使用默认环境（第一个创建的环境）
    // env: 'my-env-id',
})
const db = wx.cloud.database()

/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.aniId = 0
        this.personalHighScore = null
        this.personalHighLeval = null

        this.restart()
        this.login()
    }

    login() {
        // 获取 openid
        wx.cloud.callFunction({
            name: 'login',
            success: res => {
                window.openid = res.result.openid
                this.prefetchHighScore()
            },
            fail: err => {
                console.error('get openid failed with error', err)
            }
        })
    }

    prefetchHighScore() {
        // 预取历史最高分
        db.collection('score').doc(`${window.openid}-score`).get()
            .then(res => {
                if (this.personalHighScore) {
                    if (res.data.max > this.personalHighScore) {
                        this.personalHighScore = res.data.max
                    }
                } else {
                    this.personalHighScore = res.data.max
                }
            })
            .catch(err => {
                console.error('db get score catch error', err)
                this.prefetchHighScoreFailed = true
            })
    }
    prefetchHighLeval() {
        db.collection('leval').doc(`${window.openid}-leval`).get()
            .then(res => {
                if (this.personalHighLeval) {
                    if (res.data.max > this.personalHighLeval) {
                        this.personalHighLeval = res.data.max
                    }
                } else {
                    this.personalHighLeval = res.data.max
                }
            })
            .catch(err => {
                console.error('db get score catch error', err)
                this.prefetchHighLevalFailed = true
            })
    }
    restart() {
        if (databus.gameWin) {
            databus.reset(databus.leval)
        }
        if (databus.gameOver) {
            databus.reset(1)
        }
        canvas.removeEventListener(
            'touchstart',
            this.touchHandler
        )

        this.bg = new BackGround(ctx)
        this.player = new Player(ctx)
        this.gameinfo = new GameInfo()
        this.music = new Music()

        this.bindLoop = this.loop.bind(this)
        this.hasEventBind = false

        // 清除上一局的动画
        window.cancelAnimationFrame(this.aniId);

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }

    /**
     * 随着帧数变化的敌机生成逻辑
     * 帧数取模定义成生成的频率
     */
    enemyGenerate() {
        if (databus.frame % 30 === 0) { // 每秒60/30个敌机
            let enemy = databus.pool.getItemByClass('enemy', Enemy) // 从对象池拿一个敌机
            enemy.init(4, 2) //  每秒下落2*60px,初始血量为3
            databus.enemys.push(enemy)
        }
    }

    // 全局碰撞检测
    collisionDetection() {
        let that = this

        databus.bullets.forEach((bullet) => {
            for (let i = 0, il = databus.enemys.length; i < il; i++) {
                let enemy = databus.enemys[i]
                if (!enemy.isPlaying && enemy.isCollideWith(bullet)) { // 敌机没有playAnimation(即没发生动画)并且碰上了子弹
                    bullet.visible = false // visible是false时，下一帧就不再渲染该精灵,只要子弹撞上飞机，子弹就消失
                    enemy.blood -= 1
                    if (enemy.blood === 0) {
                        enemy.playAnimation() // 播放动画
                        that.music.playExplosion()
                        databus.score += 1
                        break
                    }
                }
            }
        })

        for (let i = 0, il = databus.enemys.length; i < il; i++) { // 检测飞机是否碰到我方
            let enemy = databus.enemys[i]

            if (this.player.isCollideWith(enemy)) {
                databus.gameOver = true
                    // 获取历史高分
                if (this.personalHighScore) {
                    if (databus.score > this.personalHighScore) {
                        this.personalHighScore = databus.score
                    }
                }

                // 上传结果
                // 调用 uploadScore 云函数
                wx.cloud.callFunction({
                    name: 'uploadScore',
                    // data 字段的值为传入云函数的第一个参数 event
                    data: {
                        score: databus.score
                    },
                    success: res => {
                        if (this.prefetchHighScoreFailed) {
                            this.prefetchHighScore()
                        }
                    },
                    fail: err => {
                        console.error('upload score failed', err)
                    }
                })

                break
            }
        }
        if (databus.frame > 780) {
            databus.gameWin = true
            databus.leval += 1
            wx.cloud.callFunction({
                name: 'uploadLeval',
                // data 字段的值为传入云函数的第一个参数 event
                data: {
                    leval: databus.leval
                },
                success: res => {
                    if (this.prefetchHighScoreFailed) {
                        this.prefetchHighLeval()
                    }
                },
                fail: err => {
                    console.error('upload leval failed', err)
                }
            })
        }
    }

    // 游戏结束后的触摸事件处理逻辑
    touchEventHandler(e) {
        e.preventDefault()

        let x = e.touches[0].clientX
        let y = e.touches[0].clientY

        let area = this.gameinfo.btnArea

        if (x >= area.startX &&
            x <= area.endX &&
            y >= area.startY &&
            y <= area.endY)
            this.restart()
    }

    /**
     * canvas重绘函数
     * 每一帧重新绘制所有的需要展示的元素
     */
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.bg.render(ctx)

        databus.bullets
            .concat(databus.enemys)
            .forEach((item) => {
                item.drawToCanvas(ctx) // 绘制精灵item
            })

        this.player.drawToCanvas(ctx) // 绘制玩家

        databus.animations.forEach((ani) => { // 每一个精灵再初始化时都会被push到databus.animations
            if (ani.isPlaying) {
                ani.aniRender(ctx) //  动画渲染
            }
        })

        this.gameinfo.renderGameScore(ctx, databus.score)
        this.gameinfo.renderGameCurLeval(ctx, databus.leval)

        // 游戏结束停止帧循环
        if (databus.gameOver || databus.gameWin) {
            if (databus.gameWin) { // 游戏通关
                // this.player.update(15)
                // setTimeout(() => {
                this.gameinfo.renderGameLeval(
                        ctx,
                        databus.leval
                    )
                    // }, 1000);

            } else if (databus.gameOver) {
                // setTimeout(() => {
                this.gameinfo.renderGameOver(
                        ctx,
                        databus.score,
                        this.personalHighScore
                    )
                    // }, 1000);
            }
            if (!this.hasEventBind) {
                this.hasEventBind = true
                this.touchHandler = this.touchEventHandler.bind(this)
                canvas.addEventListener('touchstart', this.touchHandler)
            }
        }
    }

    // 游戏逻辑更新主函数
    update() {
        this.bg.update()
        databus.bullets
            .concat(databus.enemys)
            .forEach((item) => {
                item.update()
            })
        if (databus.frame < 600) {
            this.enemyGenerate() // 生成敌机
        }
        this.collisionDetection() // 检测碰撞

        if (databus.frame % 20 === 0 && databus.frame < 720) { // 每秒3个子弹
            this.player.shoot() // 生成子弹
            this.music.playShoot()
        }
    }

    // 实现游戏帧循环
    loop() {
        databus.frame++
            this.update()
        this.render()
        if (databus.gameOver || databus.gameWin) {
            return;
        }

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}