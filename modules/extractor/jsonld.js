
const utils = require("../utils")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);


function extract(url,cbk){

	EM.emit('log:msg','url:'+url) 

	utils.get_html_data({url:url},(data)=>{

		var doc = new JSDOM(data);
		var document = doc.window.document;
  		
	 	var json_tag=  document.querySelectorAll('[type="application/ld+json"]')[0]
		var items = [] 
	 	if(json_tag){
	 		items = JSON.parse(json_tag.textContent)
	 	}
		cbk(items);
	}); 

}

module.exports = {

	extract: extract
}