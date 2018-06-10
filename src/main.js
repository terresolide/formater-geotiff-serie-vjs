require("exports-loader?!./l.min.js")

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);

//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);



import Map from './formater-map.vue';
import Test from './formater-test.vue';
ljs.addAliases({
	dep: [//'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
		 //leaflet
		//------------
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css',
		//regiter element
		//-------------
	    'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
	   // 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js',
	   // 'https://cdnjs.cloudflare.com/ajax/libs/moment-range/3.0.3/moment-range.min.js'
	    ]
})
ljs.load('dep', function() {
	
	/*window.moment = moment
	window['moment-range'].extendMoment(moment);
	
	// le tableau des composants Aeris
	if (!window.registredAerisElements) {
		window.registredAerisElements = [];
	}*/
	
	
	Vue.customElement('formater-map', Map);
	Vue.customElement('formater-test', Test);
	//window.registredAerisElements.push('formater-skeleton');
	
})

