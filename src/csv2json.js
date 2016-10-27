//Converter Class 
let Converter = require("csvtojson").Converter;
let converter = new Converter({});

converter.fromFile("./tweets.csv",function(err,result){
    let json = JSON.stringify(result);
    fs.writeFile('tweets.json', json, 'utf8');
});