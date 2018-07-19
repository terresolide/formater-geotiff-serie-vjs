<template>
<span class="formater-draggable-block">
<span class="close fa fa-close" @click="close" v-if="closeEnabled"></span>
<h4  @mousedown="movestart">{{title}}</h4>
<slot></slot>
</span>
</template>

<script>

export default {
  props:{
    title: {
      type: String,
      default: 'title'
    },
    id: {
      type: String,
      default: 'draggable-block'
    }
  },
  data () {
    return {
      color: 'black',
      aerisThemeListener: null,
      blockContentListener: null,
      mousemoveListener: null,
      mouseupListener: null,
      openBlockListener: null,
      closeBlockListenr: null,
      width: 300,
      selected: false,
      delta: {x: 0, y:0},
      pos: {x:0, y:0},
      top: 50,
      left: 50,
      closeEnabled: false,
      layerId: null
	}
  },
  watch: {
    left (newval) {
      this.$el.style.left = newval + 'px'
    },
    top (newval) {
      this.$el.style.top = newval + 'px'
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
    hide () {
      this.layerId = null
      this.$el.style.display = 'none'
    },
    close () {
      var event = new CustomEvent('closeBlockEvent', {detail: {blockId: this.id, layerId: this.layerId}})
      document.dispatchEvent(event)
    },
    enableClose (evt) {
      // receive content
      if (this.$el.style.display === 'none' && 
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
      this.layerId = evt.detail.layerId
      this.$el.style.display = 'block'
      this.top = evt.detail.top - 5
      this.left = evt.detail.left - 5
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
//     draw (evt) {
//       console.log(evt)
//     },

  },
  created () {
 	this.blockContentListener = this.enableClose.bind(this) 
    document.addEventListener('blockContentEvent', this.blockContentListener)
	
	this.openBlockListener = this.open.bind(this) 
    document.addEventListener('openBlockEvent', this.openBlockListener)
	
	this.closeBlockListener = this.hide.bind(this) 
    document.addEventListener('closeBlockEvent', this.closeBlockListener)

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
    document.removeEventListener('blockContentEvent', this.blockContentListener)
    this.blockContentListener = null 
    document.removeEventListener('openBlockEvent', this.openBlockListener)
    this.openBlockListener = null
    document.removeEventListener('closeBlockEvent', this.closeBlockListener)
    this.closeBlockListener = null
    
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
	display:none;
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