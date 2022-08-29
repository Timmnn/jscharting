<template>
  <div class="app">
    <ToolBar :CoordsConverter="CoordsConverter" @drawing_added="drawingAdded"></ToolBar>
    <ChartComp
        @wheel="zoomChart"
        :visibleCandles="visibleCandles"
        :visibleData="visibleData"
        :layout="layout"
        :drawings="drawings"
        @mousedown="chartMouseDown"
        @mouseup="chartMouseUp"
        @mousemove="chartMouseMove"

    />

  </div>
</template>

<script>
import ChartComp from "@/components/ChartComp";
import ToolBar from "@/components/ToolBar";
import {CoordsConverter} from "./utils"
import {LinePlot} from "@/components/plotTypes/line"
import {HistogramPlot} from "@/components/plotTypes/histogram";
import {VolumeProfile} from "@/components/plotTypes/volumeProfile";


export default {
  name: 'App',
  components: {ChartComp, ToolBar},
  data: () => ({
    visibleCandles: 8,
    candleShift: 0,
    chartData: {},
    visibleData: [],
    chartOptions: {
      padding: 0.30
    },
    CoordsConverter: undefined,
    layout: undefined,
    drawings: [],
    isMouseDown: false,
    dragStart: {
      x: undefined,
      y: undefined
    }
  }),
  created() {
    fetch("http://localhost:8082/data").then(res => res.json()).then((data) => {
      this.initChart(data);
    })
  },
  methods: {
    chartMouseDown(e) {
      this.isMouseDown = true;
      this.dragStart = {
        x: e.clientX,
        y: e.clientY
      }
    },
    chartMouseUp() {
      this.isMouseDown = false;
      this.dragStart = {
        x: 0,
        y: 0
      }
    },
    chartMouseMove(e) {
      if (this.isMouseDown) {
        this.candleShift -= Math.floor(e.clientX - this.dragStart.x)
        this.candleShift = Math.max(0, this.candleShift)
        this.candleShift = Math.min(this.candleShift, this.chartData.length)
        this.dragStart.x = e.clientX
        this.initChart(this.chartData)
      }
    },
    drawingAdded(drawing) {
      this.drawings.push(drawing);
    },
    initChart(data) {
      this.chartData = data;
      this.visibleData = this.getVisibleData(data);
      this.layout = this.getLayout(document.querySelector('canvas.Chart'));
      this.CoordsConverter = CoordsConverter(this.visibleData, this.layout.main[0], this.visibleCandles, this.visibleData[0].w, this.chartOptions.padding);
    },
    insertXValues(visibleData) {
      let w = visibleData[0].w

      for (let i = 0; i < this.visibleCandles; i++) {
        visibleData[i].x = i * w + (this.chartOptions.padding * w) * (i)
      }
      return visibleData;
    },
    insertWValues(visibleData) {
      let space = document.querySelector("canvas.Chart").width - (this.visibleCandles - 1) * this.chartOptions.padding
      for (let i = 0; i < visibleData.length; i++) {
        visibleData[i].w = space / visibleData.length
      }
      return visibleData;
    },
    zoomChart(e) {
      let barDifference = Math.floor(e.wheelDeltaY / 50)
      this.visibleCandles += barDifference
      this.visibleCandles = Math.max(this.visibleCandles, 0)
      this.visibleData = this.getVisibleData(this.chartData)
      this.CoordsConverter = CoordsConverter(this.visibleData, this.layout.main[0], this.visibleCandles, this.visibleData[0].w, this.chartOptions.padding);

    },
    getLayout(canvas) {
      return {
        main: [
          {
            component: "candle",
            x: 0,
            y: 0,
            w: canvas.width,
            h: canvas.height - 200
          },
          {
            component: VolumeProfile,
            x: 0,
            y: 0,
            w: canvas.width,
            h: canvas.height - 200
          }
        ],
        subplots: [
          {
            component: LinePlot,
            x: 0,
            y: canvas.height - 200,
            w: canvas.width,
            h: 100
          },
          {
            component: HistogramPlot,
            x: 0,
            y: canvas.height - 100,
            w: canvas.width,
            h: 100
          }
        ]
      }
    },

    getVisibleData(chartData) {
      let visibleCandles = this.visibleCandles
      visibleCandles = Math.max(visibleCandles, 1)
      visibleCandles = Math.min(visibleCandles, chartData.length - 1);
      let visibleData = chartData.slice(this.candleShift, visibleCandles + this.candleShift)
      visibleData = this.insertWValues(visibleData)
      visibleData = this.insertXValues(visibleData)


      return visibleData
    },
  }
}
</script>

<style>
body {
  margin: 0;
}

.app {
  display: flex;
  height: 100vh;
  outline: 1px solid red;
  overflow: hidden;
}

canvas {
  height: 100%;
  width: 100%;
}

</style>
