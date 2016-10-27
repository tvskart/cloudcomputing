"use strict";

//Converter Class 
var Converter = require("csvtojson").Converter;
var converter = new Converter({});

converter.fromFile("./tweets.csv", function (err, result) {
    var json = JSON.stringify(result);
    fs.writeFile('tweets.json', json, 'utf8');
});
//# sourceMappingURL=csv2json.js.map