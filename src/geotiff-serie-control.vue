<!-- IL S'AGIT DE GEOTIFF-VISUALIZER RENOMMER
CONTROL GEOTIFF-LAYER 
ORIGINAL - LA COPIE EST DANS formater-catalogue-component-vjs-->
<i18n>
{
  "en":{
    "wyn":  "What is my name ?",
    "nobody" :  "Nobody",
    "mynameis":  "My name is"
   },
   "fr":{
    "wyn":  "Quel est mon nom ?",
    "nobody" :  "Personne",
    "mynameis":  "Mon nom est"
   }
}
</i18n>
<template>
<span class="geotiff-serie-control" >
 <span class="geotiff-date-tooltip">{{dateInTooltip}}</span>
 <div>
  <div>
    <progress  v-show="selected!=null" :min="0" :max="last" :value="selected" @mousemove="dateFromPosition" @mouseout="hideTooltip" @click="selectFromProgress">truc</progress>
    <div v-show="!isMinScreen" class="geotiff-eye">
      <a @click="view()" class="geotiff-nav geotiff-play"  ><i class="fa" :class="hidden?'fa-eye-slash':'fa-eye'"></i></a>
      <a  v-if="resetbutton" v-show="selected!=null" @click="reset()" class="geotiff-nav geotiff-play"  ><i class="fa fa-undo"></i></a>
      <a  v-if="fullscreenbutton" v-show="selected!=null" @click="fullscreen()" class="geotiff-nav geotiff-play"  ><i class="fa" :class="isFullscreen ? 'fa-minus-square-o' : 'fa-expand'"></i></a>
	 </div>

    <div v-show="selected!=null" style="display:inline-block;min-width:300px;">
      <span class="geotiff-nav-content">
       	<a @click="goTo(first)"  class="geotiff-nav" :class="(first!=null && selected!=first)?'':'unactive'" :title="index2strdate(first)"><i class="fa fa-angle-double-left"></i></a>
   	  </span>
   	  <span class="geotiff-nav-content">
      	<a @click="previous()"  class="geotiff-nav simple" :class="selected===first?'unactive':''"><i class="fa fa-angle-left"></i></a>
      </span>
   	  <span class="geotiff-nav-content">
   	    <a @click="toggleStartStop()" class="geotiff-nav geotiff-play" :class="(selected==last)?'unactive':''" ><i class="fa" :class="playing?'fa-pause':'fa-play'"></i></a>
      </span>
      <span class="geotiff-nav-content">
        <a @click="next()" class="geotiff-nav simple"  :class="selected==last?'unactive':''"><i class="fa fa-angle-right"></i></a>
      </span>
      <span class="geotiff-nav-content">
        <a @click="goTo(last)"  class="geotiff-nav" :class="selected==last?'unactive':''" :title="index2strdate(last)"><i class="fa fa-angle-double-right"></i></a>
      </span>
    </div>

 
    <div class="geotiff-eye" :class="isMinScreen?'little-control':''" >
      <span v-show="isMinScreen">
        <a @click="view()"  class="geotiff-nav geotiff-play"><i class="fa" :class="hidden?'fa-eye-slash':'fa-eye'"></i></a>
        <a  v-if="resetbutton" v-show="selected!=null" @click="reset()" class="geotiff-nav geotiff-play"  ><i class="fa fa-undo"></i></a>
	    <a  v-if="fullscreenbutton" v-show="selected!=null" @click="fullscreen()" class="geotiff-nav geotiff-play"  ><i class="fa" :class="isFullscreen ? 'fa-minus-square-o' : 'fa-expand'"></i></a>
	  </span>
	  <div  class="geotiff-file" v-for="(item, key) in list" :data-image="item.png" v-show="keys[selected]==key" >
	    <a :href="item.tiff" title="Download Geotiff" download class="fa fa-download"> {{ date2str(item.date) }}</a>
	  </div>
    </div>
   </div>
 </div>
</span>
</template>
<script>
export default {
    props: {
      lang: {
        type: String,
        default: 'fr'
     },
     images:{
        type: [String, Array, Object],
        default: null
     },
     showatstart: {
       type: Boolean,
       default: false
     },
     resetbutton: {
       type: Boolean,
       default: false
     },
     fullscreenbutton: {
       type: Boolean,
       default: false
     }
    },
    data () {
      return {
        bbox:null,
       	selected:null,
		first:null,
        last:null,
        nextImageListener:null,
        dateChangeListener: null,
        stopListener:null,
        resizeListener: null,
        keys:[],
        playing: false,
        hidden:true,
        hasBegin:false,
        isMinScreen: false,
        imagesLength: 0,
        dateInTooltip:'',
        isFullscreen:false
      }
    },
    computed: {
	   list(){
	     if ( this.images != null) {
		   var list = JSON.parse( this.images.replace(/'/g, '"'));
		   if ( list.bbox) {
		     this.bbox = list.bbox
		   }
		   if (list.result) {
		     this.keys = Object.keys(list.result);
		     this.first = 0;
		     this.last = this.keys.length-1;
		     return list.result;
		   }else{
		     return [];
		   }
	     }else{
	       return [];
	     }
	   }
    },
    watch: {
      list (val) {
        if(this.showatstart){
          this.view()
        }
      },
      selected (val, old) {
        if(old == null) {
          this.resize()
        }
      }
    },
   destroyed: function() {
//     document.removeEventListener('aerisTheme', this.aerisThemeListener);
//    this.aerisThemeListener = null;
      document.removeEventListener('aerisResetEvent', this.resetEventListener);
      this.resetEventListener = null;
      document.removeEventListener('stopVisualisation', this.stopListener);
      this.stopListener = null;
      document.removeEventListener('nextImageEvent', this.nextImageListener);
      this.nextImageListener = null;
      document.removeEventListener('dateChangeEvent', this.dateChangeListener);
      this.dateChangeListener = null;
      window.removeEventListener('resize', this.resizeListener)
      this.resizeListener = null
    
  },
  
  created: function () {
 
    this.$i18n.locale = this.lang;
    this.nextImageListener = this.next.bind(this) 
    document.addEventListener('nextImageEvent', this.nextImageListener)
    this.dateChangeListener = this.newDate.bind(this)
    document.addEventListener('dateChangeEvent', this.dateChangeListener)
    this.stopListener = this.pause.bind(this)
    document.addEventListener('stopVisualisation', this.stopListener)
    this.resetEventListener = this.handleReset.bind(this) ;
    document.addEventListener('aerisResetEvent', this.resetEventListener)
    this.resizeListener = this.resize.bind(this)
    window.addEventListener('resize', this.resizeListener)

//  this.aerisThemeListener = this.handleTheme.bind(this) 
//    document.addEventListener('aerisTheme', this.aerisThemeListener);
  },
  mounted: function(){
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
    if (this.indexImage) {
      this.selected = this.indexImage
    }
    var event = new CustomEvent('aerisThemeRequest', {});
    document.dispatchEvent(event);
    this.resize()
  },
  methods:{
     
  date2str (date) {
    return moment(date).format("ll");
  },
  index2strdate( index){
    if( index && this.keys[index] && this.list[this.keys[index]]){
      return this.date2str( this.list[ this.keys[index]].date);
    }else{
      return "";
    }
  },
  resize () {
    if (this.$el.offsetWidth < 720) {
      this.isMinScreen = true
    }else{
      this.isMinScreen = false
    }
    this.$emit('resize')
  },
 
  newDate (event) {
    var date = event.detail
   
    var index = this.nearestDate(date, 0, this.keys.length - 1)
    console.log(index)
    this.goTo(index)
  },

  nearestDate (date, istart, iend) {
    console.log(this.keys)
    var find = false
    var exceeded = false
    console.log(date)
    var date0 = date.replace(/-/g, '')
    console.log(date0)
    while (!find && (iend - istart) > 1) {
      var mid = Math.round((istart + iend) / 2)
      console.log(mid)
      find = (this.keys[mid] === date0)
      if (this.keys[mid] > date0) {
        iend = mid
      } else {
        istart = mid
      }
    }
    if (find) {
      return mid
    } else if (iend - istart === 1){
      //find the nearest date 
      return istart
    } else {
      return -1
    }
  },
//   nearestDateBetween(date, istart, iend){
//     var datestart = moment(this.list[this.keys[istart]].date)
//     var dateend = moment(this.list[this.keys[iend]].date)
//     var datex = moment(date)
//     var before = datex.diff(datestart, 'days')
//     console.log(before)
   
//     var after = dateend.diff(datex, 'days')
// 	console.log(after)
//     if (before <= after) {
//       return istart
//     }else {
//       return iend
//     }
//   },
  next (auto) {
    if(!auto){
      this.playing = false;
    }
    this.selected += 1;
    if (this.selected < this.keys.length) {
      this.triggerImageDisplay(this.keys[this.selected]);
    }else{
     console.log(this.keys)
     this.selected = null;
    }
  },
  previous () {
    this.playing = false;
    this.selected -=1;
    if( this.selected < 0 ){
      this.selected = null;
    }else{
      this.triggerImageDisplay( this.keys[this.selected]);
    }
  },
  goTo (index) {
    this.playing = false;
    var begin = index === this.first ? true : false
    this.selected = index;
    this.triggerImageDisplay( this.keys[index]);
	if(begin) {
	  this.resize()
	}
  },
  view () {
    if (!this.hasBegin) {
      this.begin();
    }
    var evt = new CustomEvent("toggleImageSerieEvent", {detail: { show: this.hidden}});
    document.dispatchEvent(evt);
    if (this.hidden && !this.selected) {
      this.goTo(this.first)
    }
    this.hidden = !this.hidden;
    if(this.hidden){
     this.playing = false;
    }
  },
  begin () {
    this.hasBegin = true;
    this.selected = this.first -1;
    this.next();
  },
  toggleStartStop () {
    if (this.playing) {
      this.pause()
    }else{
      this.start()
    }
  },
  start () {
    this.playing = true;
    this.play();
    
  },
  play(){
    if (!this.playing) {
      return;
    }
    if (this.selected != null && this.selected < this.keys.length-1) {
      var _this = this;
      this.next(true);
      var next = function(){
        _this.play();
      }
      setTimeout(next, 1000);
   }else{
     this.playing = false;
   }
  },
  pause(){
    this.playing = false;
  },
  triggerImageDisplay( index){
    if( typeof this.list[index] == "undefined"){
   console.log( "undefined");
   return;
    }
    var info = { bbox: this.bbox, img:this.list[index].png, datestr: this.date2str( this.list[index].date), date: this.list[index].date};
    var evt = new CustomEvent("selectImageSerieEvent", {detail: info});
    document.dispatchEvent(evt);
    
  },
  indexFromPosition (evt) {
    var node = this.$el.querySelector('progress')
    var nodePos = node.getBoundingClientRect()
    //cursor position
    var posX = evt.clientX - nodePos.left
    this.$el.querySelector('.geotiff-date-tooltip').style.opacity = 1;
    if(this.last){
      //geotiff-serie-control posistion
      var posG = this.$el.getBoundingClientRect()
      //tooltip position
      this.$el.querySelector('.geotiff-date-tooltip').style.left = (nodePos.left - posG.left + posX - 50) + "px"
      return Math.round(this.last * posX / nodePos.width)
    }else{
      return null
    }
  },
  selectFromProgress (evt) {
    var index = this.indexFromPosition(evt)
    this.goTo(index)
  },
  dateFromPosition (evt) {
    var index = this.indexFromPosition(evt)
    var date = this.index2strdate(index)
    if (!date) {
      this.$el.querySelector('.geotiff-date-tooltip').style.opacity = 0;
    } else {
      this.dateInTooltip = date
    }
  },
  hideTooltip () {
    this.$el.querySelector('.geotiff-date-tooltip').style.opacity = 0;
  },
  reset () {
    this.playing = false
    this.goTo(this.first)
  },
  handleReset: function( ) {
    console.log( "handle reset from stop visualisation");
    this.selected = null;
    this.first= null;
    this.last  = null;
    this.keys =[];
    this.playing = false;
    this.hidden = true;
    this.hasBegin = false;  
  },
  fullscreen: function () {
    this.isFullscreen = !this.isFullscreen
    this.$emit('fullscreen', this.isFullscreen)
   // this.$emit('update:fullscreen', this.isFullscreen)
  }
    
    
//      handleTheme: function(theme) {
//      this.theme = theme.detail;
//    this.ensureTheme();
//    },
   
//   ensureTheme: function() {
//      if ((this.$el) && (this.$el.querySelector)) {
//     var color3 =  this.$shadeColor( this.theme.primary, 0.8);
    
    
//      }
//   }
    }
}
</script>
<style>
.geotiff-serie-control{
  position: relative;
  display:block;
}
.geotiff-serie-control > div{
  text-align:center;
  width:100%; 
  background: rgba(0, 0, 0, 0.8);
}
.geotiff-date-tooltip{
  display:block;
  padding:3px 4px;
  position:absolute;
  left:0;
  top:-20px;
  font-size:12px;
  color:white;
  border-radius:5px;
  opacity:0;
  z-index:2000;
  background: rgba(0, 0, 0, 0.8);
  pointer-events: auto;
}
.geotiff-serie-control > div > div{
  text-align:center;
  display:inline-block;
}
.geotiff-serie-control progress{
  width:300px;
  height:10px;
  display:block;
  margin:3px auto;
}
.geotiff-serie-control .geotiff-nav{
  /* background:black;*/
   color: white;
   border-radius:20px;
   font-weight:700;
   width:30px;
   vertical-align:middle;
   padding:2px 12px;
   opacity:0.7;
   font-size:1.5rem;
   cursor:pointer;
}
.geotiff-serie-control .geotiff-nav.simple{
   padding:2px 15px;
}
.geotiff-serie-control .geotiff-play{
  padding: 2px 6px 2px 10px;
}
.geotiff-serie-control .geotiff-pause{
  padding: 2px 8px 2px 8px;
}
.geotiff-serie-control .geotiff-eye{
  display:inline-block;
  min-width:200px;
}
.geotiff-serie-control .geotiff-eye.little-control{
  display: block;
}
.geotiff-nav-content{
  min-width:50px;
}
 .geotiff-serie-control .geotiff-nav:hover{ 
  opacity:1;
} 
.geotiff-serie-control .geotiff-file{
  display:inline-block;
  width:130px;
  font-size:0.8em;
  vertical-align:middle;
 
  /* box-shadow: 0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); */
}

.geotiff-serie-control .geotiff-file a{
  display:block;
  color:white;
  opacity: 0.8;
   border: 1px dotted rgba(255, 255, 255, 0.8);
  padding:2px;
  text-decoration:none;
}
.geotiff-serie-control .geotiff-file a:hover {
	opacity: 1;
}
.geotiff-serie-control a.unactive{
  pointer-events: none;
  cursor: default;
  opacity:0.2;
}
</style>
