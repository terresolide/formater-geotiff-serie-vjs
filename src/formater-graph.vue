<template>
<span class="formater-graph">
<span class="close fa fa-close" @click="close"></span>
<h4  @mousedown="movestart">{{title}}</h4>
  mon graphique
</span>
</template>

<script>

var Highchart = require('highcharts')
export default {
  props:{
    title: {
      type: String,
      default: 'title'
    }
  },
  data () {
    return {
      color: 'black',
      aerisThemeListener: null,
      graphDataListener: null,
      mousemoveListener: null,
      mouseupListener: null,
      width: 300,
      selected: false,
      delta: {x: 0, y:0},
      pos: {x:0, y:0}
	}
  },
 
  methods: {
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
    close () {
      this.$el.style.display = 'none'
    },
    open () {
      this.$el.style.display = 'block'
    },
    movestart (evt) {
      this.selected = true
      this.delta = {
          x: this.pos.x - this.$el.offsetLeft,
          y: this.pos.y - this.$el.offsetTop
      }
     
      console.log( this.$el.offsetLeft)
      console.log(evt)
    },
    move (evt) {
      // console.log(evt)
      this.pos.x = evt.clientX
      this.pos.y = evt.clientY
      if (this.selected) {
        var left = this.pos.x - this.delta.x
        var top = this.pos.y - this.delta.y
        this.$el.style.left = left + 'px'
        this.$el.style.top = top + 'px'
      }
    },
    moveEnd () {
      this.selected = false
    },
    draw (evt) {
      console.log(evt)
    },
    clear () {
      
    }
  },
  created () {
	this.graphDataListener = this.draw.bind(this) 
    document.addEventListener('graphDataEvent', this.graphDataListener);

	this.mousemoveListener = this.move.bind(this)
    document.addEventListener('mousemove', this.mousemoveListener)
    this.mouseupListener = this.moveEnd.bind(this)
    document.addEventListener('mouseup', this.mouseupListener)
    
    this.aerisThemeListener = this.handleTheme.bind(this) 
    document.addEventListener('aerisTheme', this.aerisThemeListener)
    
    var event = new CustomEvent('aerisThemeRequest', {})
    document.dispatchEvent(event);
  
  },
  mounted () {
  
  },
  destroyed () {
    document.removeEventListener('graphDataEvent', this.graphDataListener)
    this.graphDataListener = null
    
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
.formater-graph{
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
.formater-graph h4{
   margin: 0 0 10px 0;
   cursor: move;
}
.formater-graph span.close{
	position:absolute;
	top:2px;
	right:2px;
	cursor: pointer;
}
</style>