
/**
 * Module dependencies.
 */
var fs = require('fs');
var accessLogfile = fs.createWriteStream('./logs/access.log', {flags: 'a'});
var errLogfile = fs.createWriteStream('./logs/error.log', {flags:'a'});
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var ace = require('./routes/ace');
var story = require('./routes/story');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var SessionStore = require('session-mongoose')(express);
var store = new SessionStore({
    url: 'mongodb://localhost/session',
    interval: 120*1000
});
var app = express();
// express access log
app.use(express.logger({stream: accessLogfile}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
//app.use(express.logger('production'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('51fanli'));

app.use(express.session({
    secret : '51fanli',
    store: store,
    cookie: { maxAge: 900000 }
}));
app.use(function(req, res, next){    
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/ace_editor', ace.ace_editor);

app.get('/story', routes.story);
app.get('/story/:storyid',routes.story);
app.get('/story/:storyid/:catalog', routes.story);
app.get('/story/:storyid/:catalog/:api', routes.api);
/*
app.get('/add/:storyid', function(req, res){
    res.render('addcatalog', {storyid: req.params.storyid});
});
*/
app.get('/add/:storyid', routes.catalog);
//app.post('/add/:storyid', routes.doStory);
app.post('/add/:storyid', routes.doCatalog);
app.post('/story/:storyid/:catalog', routes.doCatalog);


mongoose.connect('mongodb://localhost/apibuilder');

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});