<template>
<span class="formater-graph">
	<div class="chart"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i></div>
</span>
</template>



<script>
/**
 * @prop {String} id
 * @prop {String} uom unit of measurment (symbol)
 * @prop {String} lang language code, only 'fr' or 'en'
 * @listens blockContentEvent     trigger when block content change (its data interest us)
 * @listens openBlockContent
 * @listens closeBlockContent     
 * @listens selectImageSerieEvent trigger when the image change as well as its date which interest us here.
 */
var Highcharts = require('highcharts')
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
    }
  },
  data () {
	return {
	  blockContentListener: null,
	  closeBlockListener: null,
	  selectImageSerieListener: null,
	  waiting: null
	}
  },
  methods: {
	draw (evt) {
	  var datas = evt.detail.data
	  if (datas === null){
	    return
	  }
	  var currentdate = this.currentdate
	  var coord = []
	  console.log(datas)
	  datas.forEach( function( item){
      	 var date = Date.parse(item.date);
      	 coord.push([date, item.value]);
      })
       var container = this.$el.querySelector('.chart')
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
         yAxis: {
           title: {
             text: ''
           },
           labels: {
             format: '{value:,.0f}'
           },
           lineWidth: 2
         },
         legend: {
           enabled: false
         },
         tooltip: {
           headerFormat: '<b>{point.x:%e. %b %Y}</b><br>',
           pointFormat: '{point.y:.2f} ' + this.uom
         },
         plotOptions: {
           spline: {
             marker: {
               enable: false
             }
           }
         },
         series: [{
           name: 'Valeur',
           data: coord,
           color: 'orange'
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
        this.chart.destroy()
      }
	  this.$el.querySelector('.chart').innerHTML = this.waiting
	},
	open (evt){
	  
	},
	init () {
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
	}
  },
  created () {
	this.blockContentListener = this.draw.bind(this) 
    document.addEventListener('blockContentEvent', this.blockContentListener)
    this.openBlockListener = this.open.bind(this) 
    document.addEventListener('openBlockEvent', this.openBlockListener)
	this.closeBlockListener = this.clear.bind(this)
    document.addEventListener('closeBlockEvent', this.closeBlockListener)
    this.selectImageSerieListener = this.placeLine.bind(this)
    document.addEventListener('selectImageSerieEvent', this.selectImageSerieListener)
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
  }
}
</script>

<style>
.formater-graph .chart {
	text-align:center
}
</style>