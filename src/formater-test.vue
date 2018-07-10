<template>
<span class="formater-test">
	<table style="border: 1px dotted grey;padding:3px;text-align:right;">
		<thead
			<tr>
				<th>Nombre</th>
				<th>Borne sup</th>
				<th style="max-width:50px;">10^x</th>
				<th>10^3^x</th>
				<th>Lettre</th>
				<th>Radical</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in calculated">
					<th>{{item.value}}</th>
					<td>{{item.round}}</td>
					<td>{{item.precision}}</td>
					<td>{{item.pow}}</td>
					<td>{{item.letter}}</td>
					<td>{{item.radical}} {{item.letter}}</td>
			</tr>
		</tbody>
	</table>
	</span>
</template>



<script>

export default {
  data () {
		return {
  			tests: [-25986, -32, -36985, -6998, -0.00002535, 0.00002535, 0.0000000059874, -0.02, 0.058, 0.369, 0.85, 1.02, 2.35, 6.36, 7.36, 8.69, 10.2, 12.3, 23.3, 30.4, 52.2, 89.2,
  			    101.5, 156.3, 265.8, 526.3, 863.2, 1023.5, 1253, 5632, 8963, 10258, 142365, 28632, 458632,
  			    658965, 5966345, 8958562256,  -8958562256],
  			calculated: []
		}
  },
 
  methods: {
		round (value) {
		  console.log(Math.ceil(-3))
		    var signe = value >=0 ? 1 : -1
			var ordreGrandeur = Math.ceil(Math.log(signe * value) / Math.log(10)) -1
			
		    // on arrondit au dessus (en valeur absolue)
			var p = Math.pow(10, ordreGrandeur - 1)
			var max = signe * Math.ceil(signe * value / p) * p
			
			// Nombre de puissance de 3
			var pow = Math.ceil((ordreGrandeur +1)  / 3) -1
			
		    // lettre suivant la puissance de 3
			switch (pow) {
				case -4:
			  	  var letter = 'p'
			  	  break
				case -3:
				  var letter = 'n'
			  	  break
				case -2:
				  var letter = '&micro;'
				  break
				case -1:
			  		var letter = 'm'
			  		break
				case 0:
					var letter = ''
					break
				case 1:
					var letter = 'K'
					break
				case 2:
					var letter = 'M'
					break
				case 3:
					var letter = 'G'
					break
				case 4:
				    var letter = 'T'
				    break
				default:
					var letter = 'bb'
					break
			}
			
		    //calcul du radical
			var radical =  value / Math.pow(10 , 3*pow )
			//radical = Math.round(radical * Math.pow(10, 3)) / Math.pow(10, 3)
			return {value: value, precision: ordreGrandeur, max: max, letter: letter, pow: pow,  radical: radical.toPrecision(3), round: value.toPrecision(3)}
		}
	},
	
  created () {
     for (var i = 0; i < this.tests.length; i++) {
    	 var data = this.round(this.tests[i])
    	 this.calculated[i] = data
     }
  },
  mounted: function(){
  
  }
}

</script>

<style>

</style>