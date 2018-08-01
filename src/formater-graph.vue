<template>
<span class="formater-graph formater-draggable-block" v-show="visible">
    <span class="formater-title">
    <span class="close fa fa-close" @click="close" v-if="closeEnabled"></span>
    <h4  @mousedown="movestart">{{title}}</h4>
    </span>
	<div class="chart"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i></div>
</span>
</template>



<script>
/** 
 * TROUBLE WHEN INCLUDE IN formater-draggable-block USING slot
 * Its properties are initialized when formater-draggable-block is rerender
 * then I create a graph draggable !!
 
 * @prop {String} id
 * @prop {String} uom - unit of measurment (symbol)
 * @prop {String} lang - language code, only 'fr' or 'en'
 * @prop {String} portrayal - the object portrayal to string
 * @prop {String} title
 * @listens blockContentEvent     trigger when block content change (its data interest us)
 * @listens openBlockContent
 * @listens closeBlockContent     
 * @listens selectImageSerieEvent trigger when the image change as well as its date which interest us here.
 */
 var Highcharts = require('highcharts');
//Alternatively, this is how to load Highstock. Highmaps is similar.
//var Highcharts = require('highcharts/highstock');

// array [red, green, blue] to hexadecimal color
Array.prototype.rgb2hex = function () {
  return '#' + this.map(function (x) {
    var hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}
//Load the exporting module, and initialize it.
require('highcharts/modules/pattern-fill')(Highcharts)

// Initialize exporting module.

// plotty is loaded globally in main.js
// var plotty = require('plotty')

export default {
  props:{
    id: {
      type: String,
      default: 'graph'
    },
    uom: {
      type: String,
      default: 'm'
    },
    lang: {
      type: String,
      default: 'fr'
    },
    portrayal: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: 'title'
    },
    graphwidth: {
      type: Number,
      default: 300
    }
  },
  data () {
		return {
		  // specific draggable block
		  color: 'black',
          aerisThemeListener: null,
          mousemoveListener: null,
          mouseupListener: null,
          width: 300,
          selected: false,
          delta: {x: 0, y:0},
          pos: {x:0, y:0},
          top: 50,
          left: 50,
          closeEnabled: false,
          layerId: null,
          visible: false,
          // both
		  blockContentListener: null,
		  closeBlockListener: null,
		  // for the graph
		  chart: null,
		  selectImageSerieListener: null,
		  waiting: null,
		  canvas: null,
		  pattern: null
		}
  },
  watch: {
    portrayal (newvalue) {
      this.changePattern(newvalue)
    },
    // position
    left (newval) {
      this.$el.style.left = newval + 'px'
    },
    top (newval) {
      this.$el.style.top = newval + 'px'
    },
    graphwidth (newval) {
      this.$el.style.width = newval + 'px'
      if (this.chart) {
        this.chart.setSize(newval - 15, null)
      }
    } 
   },
//   computed: {
//     pattern () {
//         var pattern = JSON.parse(this.portrayal)
//          plotty.renderColorScaleToCanvas(pattern.colorscale, this._canvas)
//   	    console.log(this._canvas.toDataURL())
//   	    this._colorImage = this._canvas.toDataURL()
//         return pattern
//     }
//   },
 
  methods: {
//     pattern () {
//       JSON.parse(this.portrayal) 
//     },
    // for move the graph window
    /**
    * Methods for draggable div
    */
     setColor (color) {
      this.$el.querySelector('h4').style.color = color
    },
    handleTheme (theme) {
      this.color = theme.detail.primary
      if (this.$el) {
        this.$el.style.width = this.width + 'px'
        this.setColor(this.color)
      }
    },
    hide () {
      this.layerId = null
      this.visible = false
    },
    close () {
      var event = new CustomEvent('closeBlockEvent', {detail: {blockId: this.id, layerId: this.layerId}})
      document.dispatchEvent(event)
    },
    enableClose (evt) {
      // receive content
      if (!this.visible && 
          (evt.detail.layerId !== this.layerId && evt.detail.open))  {
        //open
        this.open(evt)
      }
      // enableClose if content corresponds to the layer
      if (evt.detail.layerId === this.layerId) {
        this.closeEnabled = true
      }
    },
    open (evt) {
      if (evt.detail.blockId !== this.id){
        return
      }
      this.$el.style.width = this.graphwidth + 'px'
      this.layerId = evt.detail.layerId
      this.visible = true
      this.top = evt.detail.top + 12
      this.left = evt.detail.left + 2
      this.closeEnabled = evt.detail.closeEnabled
    },
    movestart (evt) {
      this.selected = true
      this.delta = {
          x: this.pos.x - this.$el.offsetLeft,
          y: this.pos.y - this.$el.offsetTop
      }
    },
    move (evt) {
      // console.log(evt)
      this.pos.x = evt.clientX
      this.pos.y = evt.clientY
      if (this.selected) {
      	this.left = this.pos.x - this.delta.x
      	this.top = this.pos.y - this.delta.y
      }
    },
    moveEnd () {
      this.selected = false
    },
    /**
    * methods for the graph
    */
    changePattern (newvalue) {
      if (newvalue == 'null') {
        this.pattern = null
        return
      }
      this.pattern = JSON.parse(newvalue)
      
      // generate image 256 * 1 of the colorscale in a canvas
      var canvas = document.createElement('canvas')
      plotty.renderColorScaleToCanvas(this.pattern.colorscale, canvas)
      
      // create a second canvas where display our background graph colorscale
       if (!this.canvas) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 1
      }
      // Prepare the colored rectangles for values inferior to displayMin and values superior to displayMax
      
      var size = 256
      var h1 = 0
      var h2 = 256
      var rate = 256 / (this.pattern.displayMax - this.pattern.displayMin)
      //compute size 
      if (this.pattern.max && this.pattern.min) {
	      if (this.pattern.max > this.pattern.displayMax || this.pattern.displayMin > this.pattern.min) {
	        var size = Math.max(this.pattern.max, this.pattern.displayMax) - Math.min(this.pattern.min, this.pattern.displayMin)
	        size = Math.round(size * rate)
	      }
	      if (this.pattern.min < this.pattern.displayMin) {
	        h1 = Math.round((this.pattern.displayMin - this.pattern.min) * rate)
	        h2 += h1
	      }
      }
     
 	  this.canvas.height = size
 	  
 	  // search first and last color
 	  if (Object.prototype.toString.call(plotty.colorscales[this.pattern.colorscale]) === '[object Object]') {
        var colors = plotty.colorscales[this.pattern.colorscale].colors
 	  } else if (Object.prototype.toString.call(plotty.colorscales[this.pattern.colorscale]) === '[object Uint8Array]') {
 	    var colors = []
 	    var length = plotty.colorscales[this.pattern.colorscale].length
 	    var color1 = Array.from(plotty.colorscales[this.pattern.colorscale].slice(0, 3))
 	    var color2 = Array.from(plotty.colorscales[this.pattern.colorscale].slice(length - 4, length - 1))
 	    colors[0] = color1.rgb2hex()
 	    colors[1] = color2.rgb2hex()
 	  }
 	  
 	  // draw background
      var ctx = this.canvas.getContext('2d')
      ctx.save()
      // Plotty draw the color scale in width so we rotate to get it in height
      ctx.translate(0, size)
	  ctx.rotate(3 * Math.PI / 2)
	  if (h1 > 0) {
	    // draw a first uniform colored rectangle for data inferior to displayMin
		ctx.fillStyle = colors[0]
		ctx.fillRect(0, 0, h1, 1)
      }
      ctx.drawImage(canvas, h1, 0, 256, 1)
      if (h2 < size) {
        // draw an uniform colored rectangle for data superior to displayMax
        ctx.fillStyle = colors[colors.length - 1]
 	    ctx.fillRect(h2, 0, size - h2, 1)
      }
      ctx.restore()
    },
    coloredImage () {
        if (this.canvas) {
    	  return this.canvas.toDataURL()
        } else {
          return null
        }
    },
	draw (evt) {
      var data = evt.detail.data
      if (data === null){
        return
      }
      var currentdate = this.currentdate
      var coord = []
      data.forEach( function( item){
     	 var date = Date.parse(item.date);
     	 coord.push([date, item.value]);
      })
      var container = this.$el.querySelector('.chart')

      var yAxis =  {
        title: {
          text: ''
        },
        labels: {
          format: '{value:,.0f}'
        },
        lineWidth: 1     
      }
      if (this.pattern) {
        yAxis.floor = this.pattern.displayMin
        yAxis.ceiling = this.pattern.displayMax
        yAxis.min = this.pattern.min
        yAxis.max =  this.pattern.max
        yAxis.tickPositions = this.createTicksPositions()   
      }
      
      this.createChart(container,coord, this.currentdate, yAxis, this.uom)  
    },
    createTicksPositions () {
      // Only if this.pattern
      if (!this.pattern) {
        return 'undefined'
      }
      var positions = [this.pattern.displayMin, this.pattern.displayMax]
      if (typeof this.pattern.min !== 'undefined') {
        positions.push(this.pattern.min)
      }
      if (typeof this.pattern.max != 'undefined') {
        positions.push(this.pattern.max)
      }
      if (this.pattern.displayMin * this.pattern.displayMax <0 || 
          (this.pattern.displayMin * this.pattern.displayMax !== 0 && 
              this.pattern.min && this.pattern.max && this.pattern.min * this.pattern.max < 0 )) {
        positions.push(0)
      }
     positions.sort(function (x1, x2) {
       return x2 < x1
     })
     return positions
    },
	createChart(container, data, currentdate, yAxis, uom){
	  var _this = this
	  this.chart = Highcharts.chart(container, {
	    
      chart: {
        height: 200,
        marginBottom: 20,
        type: 'area',
        events: {
 	       click: function (event) {
 	         var evt = new CustomEvent('dateChangeEvent', {detail: Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].value)})
 	         document.dispatchEvent(evt)
 	       }
          }
        // width: width
        },
	    credits: {
	      enabled: false
	    },
	    title: {
	      text: '',
	      margin: 0
	    },
	    xAxis: {
	      type: 'datetime',
	      dateTimeLabelFormats: { // don't display the dummy year
	          month: '%e %b %Y',
	          year: '%b %Y'
	      },
	      title: {
	        text: 'Date'
	      },
	      plotLines: [{
	        color: 'red', // Color value
	        // dashStyle: 'longdashdot', // Style of the plot line. Default to solid
	        value: currentdate,
	        id: 'currentdate',
	        zIndex: 20,
	        width: 2 // Width of the line    
	        }]
	      },
	      yAxis: yAxis,
	      legend: {
	        enabled: false
	      },
	      tooltip: {
	        headerFormat: '<b>{point.x:%e. %b %Y}</b><br>',
	        pointFormat: '{point.y:.2f} ' + uom
	      },
	      plotOptions: {
	        spline: {
	          marker: {
	            enable: false
	          }
	        },
	        area: {
	          fillColor: {
	            pattern: {
	              image: _this.coloredImage(),
	              width: 1,
	              height:200, //@todo calculer la taille du fond
	              color: '#FF4500',
	            }
	          }
	        },
	        series: {
	          point: {
	               events: {
	                 click: function () {
	                   var evt = new CustomEvent('dateChangeEvent', {detail: Highcharts.dateFormat('%Y-%m-%d', this.x)})
	      	 	         document.dispatchEvent(evt)
	                 }
	               }
	             }
	        }
	      },
	      series: [{
	        name: 'Valeur',
	        data: data,
	        color: 'black'
	      }]
        })
	  },
	  placeLine (evt) {
		  // this.chart.xAxis[0].removePlotLine(this.currentdate)
		  this.currentdate = Date.parse(evt.detail.date)
		  // this.chart.xAxis[0].removePlotLine()
		  var currentdate = this.currentdate
		  if (this.chart && this.chart.xAxis) {
			  this.chart.xAxis[0].update( {
			    plotLines: [{
		      		color: 'red', // Color value
		       		value: currentdate,
		       		id: 'currentdate',
		       		zIndex: 20,
		       		width: 2 // Width of the line    
		     	}]
			  })
		  }
		},
		clear () {
	      if (this.chart) {
	    	  if (Highcharts.charts[0] !== undefined) {
	    		  Highcharts.charts[0].destroy();
	    		  Highcharts.charts.splice(0, 1);
	    		  }
	    	  this.chart = null
	        // this.chart.destroy()
	      }
		  this.$el.querySelector('.chart').innerHTML = this.waiting
		},
		yAxis () {
		  return {
	        title: {
	          text: ''
	        },
	        labels: {
	          format: '{value:,.0f}'
	        },
	        lineWidth: 2,
	        min: this.pattern.displayMin,
	        max: this.pattern.displayMax
	      }
		},
		init () {
		  // initialise
		  this.$el.style.width = this.graphwidth + 'px'
		  this.waiting = this.$el.querySelector('.chart').innerHTML
		  if(this.lang === "fr"){
	        Highcharts.setOptions({
	          lang: {
	            months: [
	              'Janvier', 'Février', 'Mars', 'Avril',
	              'Mai', 'Juin', 'Juillet', 'Août',
	              'Septembre', 'Octobre', 'Novembre', 'Décembre'
	            ],
	            weekdays: [
	              'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
	              'Jeudi', 'Vendredi', 'Samedi'
	            ],
	            shortMonths: ["Janv." , "Févr." , "Mars" , "Avr." , "Mai" , 
	              "Juin" , "Juill." , "Août" , "Sept." , "Oct." , "Nov." , "Déc."]
	          }
	        });
		  }
		  if (this.portrayal) {
		    this.changePattern(this.portrayal)
		  }
		},
		// the both
		handleClose (event) {
		  // destroy graph
		  this.clear()
		  //close
		  this.hide()
		},
		handleContent (event) {
		  // for the block 
		  this.enableClose(event)
		  // for  the graph draw
		  this.draw(event)
		},
		handleOpen (event) {
		  console.log('open')
		  // only the block
		  this.open(event)
		}
  },
  created () {
   // console.log(this.portrayal)
    this.mousemoveListener = this.move.bind(this)
    document.addEventListener('mousemove', this.mousemoveListener)
    this.mouseupListener = this.moveEnd.bind(this)
    document.addEventListener('mouseup', this.mouseupListener)
    
	this.blockContentListener = this.handleContent.bind(this) 
    document.addEventListener('blockContentEvent', this.blockContentListener)
    this.openBlockListener = this.handleOpen.bind(this) 
    document.addEventListener('openBlockEvent', this.openBlockListener)
	this.closeBlockListener = this.handleClose.bind(this)
    document.addEventListener('closeBlockEvent', this.closeBlockListener)
    this.selectImageSerieListener = this.placeLine.bind(this)
    document.addEventListener('selectImageSerieEvent', this.selectImageSerieListener)
    
      this.aerisThemeListener = this.handleTheme.bind(this) 
    document.addEventListener('aerisTheme', this.aerisThemeListener)
    
    var event = new CustomEvent('aerisThemeRequest', {})
    document.dispatchEvent(event);
   // this.colorscaleImageListener = this.setImageUrl.bind(this)
   // document.addEventListener('colorscaleImageEvent', this.colorscaleImageListener)
  },
  mounted: function(){
    this.init()
  },
  destroyed () {
    document.removeEventListener('blockContentEvent', this.blockContentListener)
    this.blockContentListener = null
    document.removeEventListener('openBlockEvent', this.openBlockListener)
    this.openBlockListener = null
    document.removeEventListener('closeBlockEvent', this.closeBlockListener)
    this.closeBlockListener = null
    document.removeEventListener('selectImageSerieEvent', this.selectImageSerieListener)
    this.selectImageSerieListener = null
    
    document.removeEventListener('mousemove', this.mousemoveListener)
    this.mousemoveListener = null
    document.removeEventListener('mouseup', this.mouseupListener)
    this.mouseupListener = null
    
    document.removeEventListener('aerisTheme', this.aerisThemeListener)
    this.aerisThemeListener = null
 
  }
}
</script>

<style>
.formater-graph .chart {
	text-align:center
}
.formater-draggable-block{
	position:absolute;
	top:50px;
	left:50px;
	z-index:2000;
	background:white;
	min-width:300px;
	min-height:100px;
	padding:10px;
	display:block;
	border-radius:5px;
	box-shadow: 0 1px 5px #888;
}
.formater-draggable-block h4{
   margin: 0 0 10px 0;
   cursor: move;
}
.formater-draggable-block span.close{
	position:absolute;
	top:2px;
	right:2px;
	cursor: pointer;
}
</style>