<template>
  <div class="toolbar">
    <button @click="startLineDrawing">Line</button>
    <button @click="startVerticalLineDrawing">Vertical</button>
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  props: {
    CoordsConverter: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      line: {
        x_1: undefined,
        y_1: undefined,
        x_2: undefined,
        y_2: undefined,
      },
      verticalLine: {
        y: undefined
      }
    }
  },
  methods: {
    startVerticalLineDrawing() {
      let canvas = document.querySelector("canvas.Chart")
      let vue = this
      canvas.addEventListener("click", getCoordinates)

      function getCoordinates(e){
        let y = e.clientY
        let ctx = canvas.getContext("2d")

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()


        vue.$emit("drawing_added", {
          price: vue.CoordsConverter.yToPrice(y - canvas.getBoundingClientRect().top),
          type: "verticalLine",
        })

        canvas.removeEventListener("click", getCoordinates)


      }
    },

    startLineDrawing() {
      let canvas = document.querySelector("canvas.Chart")
      let vue = this

      function getCoordinates(e) {
        if (!vue.line.x_1) {
          vue.line.x_1 = e.x - canvas.getBoundingClientRect().left;
          vue.line.y_1 = e.y - canvas.getBoundingClientRect().top;
        } else {
          vue.line.x_2 = e.x - canvas.getBoundingClientRect().left;
          vue.line.y_2 = e.y - canvas.getBoundingClientRect().top;
          let ctx = canvas.getContext("2d");
          ctx.beginPath();


          ctx.moveTo(vue.line.x_1, vue.line.y_1);
          ctx.lineTo(vue.line.x_2, vue.line.y_2);
          ctx.stroke();


          let drawing = {
            type: "line",
            time_1: vue.CoordsConverter.xToTime(vue.line.x_1),
            price_1: vue.CoordsConverter.yToPrice(vue.line.y_1),
            time_2: vue.CoordsConverter.xToTime(vue.line.x_2),
            price_2: vue.CoordsConverter.yToPrice(vue.line.y_2),
          }


          vue.$emit("drawing_added", drawing)


          vue.line = {
            x_1: undefined,
            y_1: undefined,
            x_2: undefined,
            y_2: undefined,
          }


          canvas.removeEventListener("click", getCoordinates);

        }
      }

      canvas.addEventListener("click", getCoordinates)
    }
  }
}
</script>

<style scoped lang="scss">
.toolbar{
  width: 45px;
  display: flex;
  flex-direction: column;
  button{
    font-size: 10px;
  }
}

</style>