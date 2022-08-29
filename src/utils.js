const {toRaw} = require("vue");
exports.CoordsConverter = function (chartData, constraints, visible_candles, candleWidth, padding) {
    let min, max
    max = Math.max(...chartData)
    min = Math.min(...chartData)

    if (Object.keys(toRaw(chartData)[0]).includes("ohlcv")) {
        min = Math.min(...chartData.map(x => toRaw(x)).map(x => x.ohlcv[2]))
        max = Math.max(...chartData.map(x => toRaw(x)).map(x => x.ohlcv[1]))
    }


    let plot_height = constraints.h
    //let plot_width = constraints.w
    let plot_y = constraints.y
    //let plot_x = constraints.x

    return {
        priceToY(price) {
            return plot_height - ((price - min) / (max - min) * plot_height) + plot_y
        },
        xToTime(x) {
            let candle_index = Math.floor(x / (candleWidth * (1 + padding)))
            return chartData[candle_index].time
        },
        yToPrice(y) {
            let price = (plot_height - y) / plot_height * (max - min) + min

            return price
        },
        timeToX(time) {
            for (let datapoint of chartData) {
                if (datapoint.time === time) {
                    return datapoint.x
                }
            }
        }
    }

}

