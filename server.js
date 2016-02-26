var express = require("express");
var url = require("url");
var mongo = require("mongodb").MongoClient;


var app = express();


mongo.connect('mongodb://localhost:27017/sites', function(err, db){
    if(err) throw err;
    var short = db.collection('siteList');
    

    app.use(express.static('client'));
    app.get('/*', function(request, response){
       
        var shortURL = url.parse(request.url).path.substring(5);
        
        
        if(isUrl(shortURL)){
            if(short.find({url:shortURL}).toArray(function(err, data) {
                if(err)throw err;
                // console.log(data.length);
                if(data.length > 0){
                    var genId = data[0].id;
                    console.log(genId);
                    var orig = data[0].url;
                    var data = {
                        'originalURL':"<a href="+shortURL+">"+shortURL+"</a>",
                        'shortURL':'<a href='+url+">https://url-shortener-thespitefuloctopus.c9users.io/"+genId+"</a>"
                    }
                    response.send(JSON.stringify(data));
                }
            })){
                
            } else {
                var genId = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                
                for( var i=0; i < 3; i++ ){
                    genId += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                short.insert({
                    url:shortURL,
                    id: genId,
                    orig: 'https://url-shortener-thespitefuloctopus.c9users.io/'
                });
                var data = {
                    'originalURL':"<a href="+shortURL+">"+shortURL+"</a>",
                    'shortURL':'<a href='+shortURL+">https://url-shortener-thespitefuloctopus.c9users.io/"+genId
                }
                response.send(JSON.stringify(data));
            };
        } else if (url.parse(request.url).path.length === 4) {
            var shortCode = url.parse(request.url).path.split('/')[1];
            
            short.find({ id:shortCode }).toArray(function(err,data){
                if(err)throw err;
                // console.log(data);
                var data = {
                    'originalURL':"<a href="+data[0].url+">"+data[0].url+"</a>",
                    'shortURL':'<a href='+data[0].url+">https://url-shortener-thespitefuloctopus.c9users.io/"+data[0].id+"</a>"
                }
                response.send(JSON.stringify(data));
            });
        } else {
            var data = {
                'error':'Invalid URL'
            }
            response.send(JSON.stringify(data));
        }
        
    }).listen(8080, function(){
        console.log("listening on port 8080");
    });

});

function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

function genId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 3; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}