<template>
  <div class="container">
    <PriceAxis class="PriceAxis"/>
    <ChartMainArea
        class="Chart"
        :visibleCandles="visibleCandles"
        :visibleData="visibleData"
        :layout="layout"
        :drawings="drawings"
    />
    <TimeAxis class="TimeAxis"/>
  </div>
</template>

<script>
import PriceAxis from "@/components/PriceAxis";
import ChartMainArea from "@/components/ChartMainArea";
import TimeAxis from "@/components/TimeAxis";

export default {
  name: "ChartComp",
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
  components: {
    TimeAxis, PriceAxis, ChartMainArea
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 50px;
  grid-template-rows: 1fr 1fr 50px;
  gap: 0 0;
  grid-template-areas:
    "Chart Chart PriceAxis"
    "Chart Chart PriceAxis"
    "TimeAxis TimeAxis .";
  flex-grow: 1;
}

.PriceAxis {
  background: #0d0d18;
  grid-area: PriceAxis;
}

.Chart {
  background: #151a24;
  grid-area: Chart;
}

.TimeAxis {
  background: #0c1115;
  grid-area: TimeAxis;
}
</style>