export default class Candle {
    constructor(data, ctx, priceConverter, options = {}) {
        let defaultOptions = {
            style: {
                candleBody: {
                    up: "#1ba49a",
                    down: "#f25856",
                }
            }
        }
        // merge options
        options = {
            ...defaultOptions, ...options
        }
        this.priceConverter = priceConverter.priceToY;
        this.options = options;
        this.draw(data, ctx);
    }

    draw(data, ctx) {
        if (data.ohlcv[0] > data.ohlcv[3]) { // Open > Close
            ctx.fillStyle = this.options.style.candleBody.down
        } else {
            ctx.fillStyle = this.options.style.candleBody.up
        }


        // eslint-disable-next-line no-constant-condition
        if (this.options.footprintMode || true) {
            this.draw_footprint_candle(data, ctx);
        } else {
            this.draw_normal_candle(data, ctx);
        }


    }

    draw_footprint_candle(data, ctx) {

        let body_height = this.priceConverter(data.ohlcv[3]) - this.priceConverter(data.ohlcv[0])
        let body_width = Math.min(5, data.w);
        let wick_width = 1
        let wick_height = this.priceConverter(data.ohlcv[1]) - this.priceConverter(data.ohlcv[2])
        ctx.fillRect(data.x, this.priceConverter(data.ohlcv[0]), body_width, body_height)
        ctx.fillRect(data.x + 2, this.priceConverter(data.ohlcv[2]), wick_width, wick_height)
        ctx.stroke();

        let spacing = 2
        let print_width = data.w - body_width - spacing

        if (print_width < 15) {
            return
        }


        ctx.fillRect(data.x + body_width + spacing, this.priceConverter(data.ohlcv[2]), print_width, wick_height)


        let price_steps = 10
        let box_height = this.priceConverter(data.ohlcv[1]) - this.priceConverter(data.ohlcv[1] - price_steps)

        ctx.fillStyle = "#ffb100";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let price = Math.ceil(data.ohlcv[1] / price_steps) * price_steps; price > data.ohlcv[2]; price -= price_steps) {
            ctx.strokeRect(data.x + body_width + spacing, this.priceConverter(price), print_width, -box_height)

            ctx.fillText(price, data.x + body_width + spacing + print_width / 2, this.priceConverter(price) - box_height / 2, print_width)
        }


    }

    draw_normal_candle(data, ctx) {

        let body_height = this.priceConverter(data.ohlcv[3]) - this.priceConverter(data.ohlcv[0])
        let wick_height = this.priceConverter(data.ohlcv[1]) - this.priceConverter(data.ohlcv[2])


        ctx.fillRect(data.x, this.priceConverter(data.ohlcv[0]), data.w, body_height)
        ctx.fillRect(data.x + data.w / 2 - 1, this.priceConverter(data.ohlcv[2]), 2, wick_height)
        ctx.stroke();
    }
}