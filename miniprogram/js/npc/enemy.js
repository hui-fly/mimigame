import Animation from '../base/animation'
import DataBus from '../databus'

const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH = 60
const ENEMY_HEIGHT = 60

const __ = {
    speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end) {
    return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
    constructor() {
        super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

        this.initExplosionAnimation()
    }

    init(speed, blood) {
        this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
        this.y = -this.height
        if (this.x > (window.innerWidth - ENEMY_WIDTH) / 2) {
            this.turnRight = true
            this.turnLeft = false
        } else {
            this.turnRight = false
            this.turnLeft = true
        }

        this[__.speed] = speed
        this.blood = blood
        this.visible = true
    }

    // 预定义爆炸的帧动画
    initExplosionAnimation() {
        let frames = []

        const EXPLO_IMG_PREFIX = 'images/explosion'
        const EXPLO_FRAME_COUNT = 19

        for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
            frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
        }

        this.initFrames(frames)
    }

    // 每一帧更新敌机位置
    update() {
        this.y += this[__.speed]
        if (this.turnRight) {
            if (this.x < window.innerWidth - this.width) {
                this.x += 1
            } else {
                this.turnRight = false
                this.turnLeft = true
            }
        }
        if (this.turnLeft) {
            if (this.x > 0) {
                this.x -= 1
            } else {
                this.turnRight = true
                this.turnLeft = false
            }
        }

        // 对象回收
        if (this.y > window.innerHeight + this.height)
            databus.removeEnemey(this)
    }
}