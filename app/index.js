var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var app = module.exports = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/../public'));

app.use('/:id', function(req, res, next) {
	fs.stat(__dirname + '/../public/' + req.params.id + '.html', function(err, stat) {
		if(err == null) {
			res.sendFile(path.resolve(__dirname + '/../public/' + req.params.id + '.html'));
		} else {
			next();
		}
	});
});

app.use(function(req, res, next) {
		console.log('404 REQUESTED URL:', req.originalUrl, 'BODY:', req.body);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
