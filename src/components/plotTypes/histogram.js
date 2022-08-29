import {CoordsConverter} from "@/utils"
import {toRaw} from "vue";


class HistogramPlot {
    constructor(data, constraints, canvas) {
        this.data = data
        this.open_prices = data.map(x => toRaw(x)).map(x => x.ohlcv[0])
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.constraints = constraints;
        this.render()
    }

    render() {
        let priceConverter = CoordsConverter(this.data, this.constraints, this.open_prices, this.data[0].w, 0.3)
        for (let i = 0; i < this.data.length - 1; i++) {
            new HistogramBar(this.data[i].ohlcv[0], this.data[i].x, this.data[i].w, priceConverter.priceToY, this.ctx, this.canvas.height)
        }
    }

}

class HistogramBar {
    constructor(price, x, w, priceConverter, ctx, height) {
        this.price = price;
        this.x = x;
        this.w = w;
        this.priceConverter = priceConverter;
        this.ctx = ctx;
        this.height = height;
        this.draw()
    }

    draw() {
        let y = this.priceConverter(this.price)


        function randomHsl() {
            return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
        }

        this.ctx.fillStyle = randomHsl();
        this.ctx.fillStyle = "#37F";
        this.ctx.fillRect(this.x, this.height, this.w, y - this.height)
        this.ctx.stroke();

    }
}

export {HistogramPlot}