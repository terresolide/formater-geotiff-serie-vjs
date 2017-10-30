<i18n>
{
   "en":{
       "wyn": 		"What is my name ?",
       "nobody" :	"Nobody",
       "mynameis":	"My name is"
   },
   "fr":{
       "wyn": 		"Quel est mon nom ?",
       "nobody" :	"Personne",
       "mynameis":	"Mon nom est"
   }
}
</i18n>

<template>
	<input type="button" @click="message" :value="$t('wyn')"/>
</template>



<script>
export default {

  props:{
      name: {
          type: String,
          default:'nobody'
      },
      lang: {
          type: String,
          default: 'fr'
      }
      
  },
  data () {
		return {
  			pseudo: 'Truc'
		}
  },
 
  methods: {
		message: function() {

			alert( this.$i18n.t('mynameis')+ " " +  this.$i18n.t(this.name) );
		}
	},
	
  created: function(){
      this.$i18n.locale = this.lang;
  },
  mounted: function(){
      
  }
}

</script>
<style>

</style>