const ext_microtada = require("./microdata")
const ext_jsonld = require("./jsonld")
/*
	extrae los datos de la url intenta extraer el jsonld o el microdata
*/

function extract_data(url,cbk){


	var data = []

	var extractors = [ext_microtada,ext_jsonld];
	 
	var promises = extractors.map(function(extractor) {

	  return new Promise(function(resolve, reject) {

	  	extractor.extract(url,(cartelera)=>{
	  		data = data.concat(cartelera)
			resolve();
		})		
	    
	  });
	
	});

	Promise.all(promises).then(function() { 
		console.log("termino todo")
		 cbk(data) 
			 
	})
	.catch(console.error);


 
}


module.exports = {
	extract_data: extract_data
} 