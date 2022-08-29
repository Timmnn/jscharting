class VolumeProfile {
    constructor(data, constraints, canvas) {
        this.data = data
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.render()
    }

    render() {
        let bar_count = 20;
        let h = this.canvas.height / 20
        for (let i = 0; i < bar_count; i++) {
            new HistogramBar(i * h, h, Math.random() * 100, this.ctx, this.canvas)
        }
    }

}

class HistogramBar {
    constructor(y, height, width, ctx, canvas) {
        this.h = height;
        this.y = y;
        this.w = width;
        this.ctx = ctx;
        this.canvas = canvas;
        this.draw()
    }

    draw() {
        this.ctx.fillRect(this.canvas.width, this.y, this.w, this.h)
    }
}

export {VolumeProfile}