<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import Candle from "../primitives/candle";
import {CoordsConverter} from "@/utils"


export default {
  name: "ChartMainArea",

  props: {
    visibleCandles: {
      type: Number
    },
    visibleData: {
      type: Array,
    },
    layout: {
      type: Object,
    },
    drawings: []
  },
  methods: {
    render() {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      this.calcCandleWidth();
      let layout = this.layout;
      const priceConverter = CoordsConverter(this.visibleData, layout.main[0], this.$refs.canvas);
      this.drawLayoutBorders(layout, ctx)
      for (let candle of this.visibleData) {
        new Candle(candle, ctx, priceConverter)
      }

      for (let plot of this.layout.main.slice(1, this.layout.main.slice.length)) {
        new plot.component(this.visibleData, plot, this.$refs.canvas);
      }


      for (let subplot of layout.subplots) {
        new subplot.component(this.visibleData, subplot, this.$refs.canvas);
      }

      for (let drawing of this.drawings) {
        console.log(drawing)
        switch (drawing.type) {
          case "line": {
            let x_1 = priceConverter.timeToX(drawing.time_1)
            let y_1 = priceConverter.priceToY(drawing.price_1)
            let x_2 = priceConverter.timeToX(drawing.time_2)
            let y_2 = priceConverter.priceToY(drawing.price_2)


            console.log("drawing", x_1, y_1, x_2, y_2)


            ctx.beginPath();
            ctx.moveTo(x_1, y_1);
            ctx.lineTo(x_2, y_2);
            ctx.stroke();
            break;
          }
          case "verticalLine": {
            ctx.beginPath();
            let y = priceConverter.priceToY(drawing.price)
            console.log("::)", y, drawing.price)
            ctx.moveTo(0, y)
            ctx.lineTo(this.$refs.canvas.width, y);
            ctx.stroke();
          }
        }
      }


    },
    calcCandleWidth() {
      return 30;
    },
    drawLayoutBorders(layout, ctx) {
      ctx.strokeStyle = "#292e38"
      ctx.beginPath();

      ctx.moveTo(layout.main[0].x, layout.main[0].y);
      ctx.lineTo(layout.main[0].x + layout.main[0].w, layout.main[0].y);
      ctx.lineTo(layout.main[0].x + layout.main[0].w, layout.main[0].y + layout.main[0].h);
      ctx.lineTo(layout.main[0].x, layout.main[0].y + layout.main[0].h);
      ctx.lineTo(layout.main[0].x, layout.main[0].y);
      ctx.stroke();

      ctx.moveTo(layout.subplots[0].x, layout.subplots[0].y);
      ctx.lineTo(layout.subplots[0].x + layout.subplots[0].w, layout.subplots[0].y);
      ctx.lineTo(layout.subplots[0].x + layout.subplots[0].w, layout.subplots[0].y + layout.subplots[0].h);
      ctx.lineTo(layout.subplots[0].x, layout.subplots[0].y + layout.subplots[0].h);
      ctx.lineTo(layout.subplots[0].x, layout.subplots[0].y);
      ctx.stroke();
    }
  },

  mounted() {
    this.$refs.canvas.height = this.$refs.canvas.getBoundingClientRect().height;
    this.$refs.canvas.width = this.$refs.canvas.getBoundingClientRect().width;
  },
  watch: {
    visibleCandles: function () {
      if (Object.keys(this.visibleData).length > 0) {
        this.render();
      }
    },
    visibleData: function (new_value) {
      if (new_value !== {}) {
        this.render()
      }
    }
  }
}
</script>

<style scoped>

</style>