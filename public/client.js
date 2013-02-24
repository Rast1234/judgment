/**
 * Client UI
 * Author: Burlak Ilia
 */
var express = require('express'), 
    app = express();


app.get("/", function(req, res){
    var html = '<div id="content" data-stack="node" data-appname="' + process.env['DOTCLOUD_PROJECT'] + '">';
    html += 'Hello World, from Express!';
    
    res.send(html);
});

app.listen(8080);