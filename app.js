var express = require('express'),
    stylus = require('stylus');

var app = express();

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware({
    src: __dirname + "/public", compile: compile
    })
);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.end("Hi there!");
})

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});