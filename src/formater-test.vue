<template>
<span class="formater-test">
	<table>
		<thead
			<tr>
				<th>Nombre</th>
				<th>Borne sup</th>
				<th>Presision</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in calculated">
					<th>{{item.value}}</th>
					<td>{{item.round}}</td>
					<td>{{item.precision}}</td>
					<td>{{item.letter}}</td>
					<td>{{item.radical}}</td>
			</tr>
		</tbody>
	</table>
	</span>
</template>



<script>

export default {
  data () {
		return {
  			tests: [0.058, 0.369, 0.85, 1.02, 2.35, 6.36, 7.36, 8.69, 10.2, 12.3, 23.3, 30.4, 52.2, 89.2,
  			    101.5, 156.3, 265.8, 526.3, 863.2, 1023.5, 1253, 5632, 8963, 10258, 142365, 28632, 458632,
  			    658965, 8958562256],
  			calculated: []
		}
  },
 
  methods: {
		round (value) {
			var precision = Math.round(Math.log(value) / Math.log(10))
			var p = Math.pow(10, precision - 1)
			var max = Math.ceil(value / p) * p
			var pow = Math.round(precision / 3)
			switch (pow) {
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
					var letter = 'Mi'
					break
				default:
					var letter = 'bb'
					break
			}
			var modulo = precision%3
			var radical = value / Math.pow(10 , pow)
			var radical = Math.round(radical * Math.pow(10, modulo)) / Math.pow(10, modulo)
			return {value: value, precision: precision, round: max, letter: letter, pow: pow, modulo: modulo, radical: radical}
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