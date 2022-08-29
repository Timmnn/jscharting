import {CoordsConverter} from "@/utils"
import {toRaw} from "vue";


class LinePlot {
    constructor(data, constraints, canvas) {
        this.data = data
        this.open_prices = data.map(x => toRaw(x)).map(x => x.ohlcv[0])
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.constraints = constraints;
        this.render()
    }

    render() {
        let priceConverter = CoordsConverter(this.open_prices, this.constraints, this.canvas).priceToY;
        for (let i = 0; i < this.data.length - 1; i++) {
            new Line(this.data[i].ohlcv[0], this.data[i + 1].ohlcv[0], this.data[i].x + this.data[i].w / 2, this.data[i + 1].x + this.data[i + 1].w / 2, priceConverter, this.ctx)
        }
    }

}

class Line {
    constructor(price_1, price_2, x_1, x_2, priceConverter, ctx) {
        this.price_1 = price_1;
        this.price_2 = price_2;
        this.x_1 = x_1;
        this.x_2 = x_2;
        this.priceConverter = priceConverter;
        this.ctx = ctx;
        this.draw()
    }

    draw() {
        this.ctx.strokeStyle = "#b319c4"
        this.ctx.lineWidth = 2

        let y_1 = this.priceConverter(this.price_1)
        let y_2 = this.priceConverter(this.price_2)


        this.ctx.beginPath();
        this.ctx.moveTo(this.x_1, y_1);
        this.ctx.lineTo(this.x_2, y_2);
        this.ctx.stroke();

        this.ctx.lineWidth = 1
    }
}

export {LinePlot}