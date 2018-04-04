const utils = require("../utils")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);

 
//uso jquery porque facilita procesos como nestest
const $ = require("jquery")(window)

/*
	extrae los datos y los pasa a jsonld segun la guia https://www.w3.org/TR/microdata/#jsonLD

*/


function get_prop_value(dom_elem){

	var value = "";

	if(dom_elem.hasAttribute("itemscope")){
		value = get_item(dom_elem)
	}
	else if(dom_elem.hasAttribute("href") || dom_elem.hasAttribute("src")){
		value = dom_elem.getAttribute("href") || dom_elem.getAttribute("src");
	}else if(dom_elem.hasAttribute("context")){
		value = dom_elem.getAttribute("context")
	}else{
		value = dom_elem.textContent
	}


	return value;
}
function get_item_properties(item){

	var properties = {}

	item.querySelectorAll("[itemprop]").forEach(function(e,i){

		//si soy el padre de esa property
		var es_mio ="";
		if(e.hasAttribute("itemscope")){
			
			es_mio = $(e).parent().closest("[itemscope]")[0] == item;
		}else{
			 es_mio = $(e).closest("[itemscope]")[0] == item;
		}
		

		if(es_mio){
			var prop = e.getAttribute("itemprop");
		
			var value = get_prop_value(e);

			//si exsite es un array

			if(properties[prop]){

				if(  Array.isArray(properties[prop])){
					properties[prop].push(value)
				}else{
					let tem = properties[prop];
					properties[prop] = []
					properties[prop].push(tem);
					properties[prop].push(value);

				}
			}else{
				properties[prop] = value;
			}
				
		}
		


	})
	return properties;
}
function get_item(e,with_context){


	var type = e.getAttribute("itemtype")
	var properties = get_item_properties(e);
 	var item =  {}

	var aux = type.split("/")
	item["@type"] = aux[aux.length - 1]
	if(with_context){
		item["@context"] = "http://schema.org/"
	} 
	for(prop in properties){
		 item[prop] = properties[prop]

	}
 

	return item;
}

 
function get_root_itmes(){
	
}

function extract(url,cbk){

	EM.emit('log:msg','url:'+url) 

	utils.get_html_data({url:url},(data)=>{

		var doc = new JSDOM(data);
		var document = doc.window.document;
  		
		var items = []
		document.querySelectorAll("[itemscope]").forEach(function(e,i){
			if(!e.hasAttribute("itemprop")){

				var type = e.getAttribute("itemtype")

			 
				items.push(get_item(e,true) )
			}

		})

		cbk(items);
	}); 

}


module.exports = {

	extract: extract
}