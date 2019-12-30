const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
    renderGameScore(ctx, score) {
        ctx.fillStyle = "#ffffff"
        ctx.font = "20px Arial"

        ctx.fillText(
            score,
            10,
            30
        )
    }
    renderGameCurLeval(ctx, leval = 1) {
        ctx.fillStyle = "#ffffff"
        ctx.font = "20px Arial"

        ctx.fillText(
            `第${leval}关`,
            screenWidth / 2 - 80,
            30
        )
    }
    renderGameLeval(ctx, leval) {
        ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)
        ctx.fillStyle = "#ffffff"
        ctx.font = "20px Arial"
        ctx.fillText(
            '恭喜通关🎉',
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 50
        )
        ctx.fillText(
            '继续',
            screenWidth / 2 - 20,
            screenHeight / 2 - 100 + 205
        )
        ctx.fillText(
            '点击进入: 第' + leval + '关',
            screenWidth / 2 - 70,
            screenHeight / 2 - 100 + 130
        )
        this.btnArea = {
            startX: screenWidth / 2 - 40,
            startY: screenHeight / 2 - 100 + 180,
            endX: screenWidth / 2 + 50,
            endY: screenHeight / 2 - 100 + 255
        }
    }
    renderGameOver(ctx, score, personalHighScore) {
        ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

        ctx.fillStyle = "#ffffff"
        ctx.font = "20px Arial"

        ctx.fillText(
            '游戏结束',
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 50
        )

        ctx.fillText(
            '得分: ' + score,
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 130
        )

        if (personalHighScore) {
            ctx.fillText(
                '最高分: ' + personalHighScore,
                screenWidth / 2 - 40,
                screenHeight / 2 - 100 + 160
            )
        }

        ctx.drawImage(
            atlas,
            120, 6, 39, 24,
            screenWidth / 2 - 60,
            screenHeight / 2 - 100 + 180,
            120, 40
        )

        ctx.fillText(
            '重新开始',
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 205
        )

        /**
         * 重新开始按钮区域
         * 方便简易判断按钮点击
         */
        this.btnArea = {
            startX: screenWidth / 2 - 40,
            startY: screenHeight / 2 - 100 + 180,
            endX: screenWidth / 2 + 50,
            endY: screenHeight / 2 - 100 + 255
        }
    }
}