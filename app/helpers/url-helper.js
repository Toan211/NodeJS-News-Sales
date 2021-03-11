var https = require('https');
var parseString = require('xml2js').parseString;

let xmlToJson = (url, callback) => {
	var req = https.get(url, function(res) {
	  var xml = '';
	  
	  res.on('data', function(chunk) {
		xml += chunk;
	  });
  
	  res.on('error', function(e) {
		callback(e, null);
	  }); 
  
	  res.on('timeout', function(e) {
		callback(e, null);
	  }); 
  
	  res.on('end', function() {
		parseString(xml, function(err, result) {
		  callback(null, result);
		});
	  });
	});
  }

  

module.exports = {
    xmlToJson
}