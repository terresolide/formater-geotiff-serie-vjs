<template>
<span class="formater-graph">
<span class="close fa fa-close" @click="close"></span>
<h4 @mousemove="move" @mousedown="movestart">{{title}}</h4>
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
      width: 300
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
      console.log(evt)
    },
    move (evt) {
      console.log(evt)
    },
    draw (evt) {
      
    },
    clear () {
      
    }
  },
  created () {
	this.graphDataListener = this.draw.bind(this) 
    document.addEventListener('graphDataEvent', this.graphDataListener);
	this.aerisThemeListener = this.handleTheme.bind(this) 
    document.addEventListener('aerisTheme', this.aerisThemeListener);
    var event = new CustomEvent('aerisThemeRequest', {});
    document.dispatchEvent(event);
  },
  mounted (){
  
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