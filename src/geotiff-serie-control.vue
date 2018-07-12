<!-- IL S'AGIT DE GEOTIFF-VISUALIZER RENOMMER
CONTROL GEOTIFF-LAYER -->
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
<span class="geotiff-serie-control">
  <div>
    
    <div style="display:inline-block;margin-right:50px">
   <a @click="view()" id="geotiffEye" class="geotiff-nav geotiff-play"  ><i class="fa" :class="hidden?'fa-eye-slash':'fa-eye'"></i></a>
     </div>
    <div v-show="selected!=null" style="display:inline-block;">
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

    <div v-show="selected!=null" style="display:inline-block;margin-left:50px;">
	    <div class="geotiff-file" v-for="(item, key) in list" :data-image="item.png" v-show="keys[selected]==key" >
	   <a :href="item.tiff" title="Download Geotiff" download class="fa fa-download"> {{ date2str(item.date) }}</a>
	   </div>
    </div>
  </div>
</span>
</template>
<script>

//ajoute un commentaire
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
     }
    },
    data () {
      return {
        bbox:null,
       	selected:null,
		first:null,
        last:null,
        nextImageListener:null,
        stopListener:null,
        keys:[],
        playing: false,
        hidden:true,
        hasBegin:false
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
    
  },
  
  created: function () {
    console.log(this.showAtStart)
    this.$i18n.locale = this.lang;
    this.nextImageListener = this.next.bind(this) 
    document.addEventListener('nextImageEvent', this.nextImageListener);
    this.stopListener = this.pause.bind(this);
    document.addEventListener('stopVisualisation', this.stopListener);
    this.resetEventListener = this.handleReset.bind(this) ;
    document.addEventListener('aerisResetEvent', this.resetEventListener);

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
  next (auto) {
    if(!auto){
   this.playing = false;
    }
    this.selected += 1;
    if( this.selected < this.keys.length){
   this.triggerImageDisplay( this.keys[this.selected]);
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
    this.selected = index;
    this.triggerImageDisplay( this.keys[index]);
  },
  view () {
    if (!this.hasBegin) {
      this.begin();
    }
    var evt = new CustomEvent("toggleImageSerieEvent", {detail: { show: this.hidden}});
    document.dispatchEvent(evt);
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
    var info = { bbox: this.bbox, img:this.list[index].png, date: this.date2str( this.list[index].date)};
    var evt = new CustomEvent("selectImageSerieEvent", {detail: info});
    document.dispatchEvent(evt);
    
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
.geotiff-serie-control > div{
  text-align:center;
  background: rgba(0, 0, 0, 0.8);
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
.geotiff-nav-content{
  min-width:50px;
}
 .geotiff-serie-control .geotiff-nav:hover{ 
  opacity:1;
} 
.geotiff-serie-control .geotiff-file{
  display:inline-block;
  width:130px;
  vertical-align:middle;
  box-shadow: 0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);
}

.geotiff-serie-control .geotiff-file a{
  display:block;
  color:white;
}
.geotiff-serie-control a.unactive{
  pointer-events: none;
  cursor: default;
  opacity:0.2;
}
</style>
