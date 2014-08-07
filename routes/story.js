var SpoofApi = require('../models/spoofapi');
var qs = require('querystring');
var url = require('url');
var beautify = require("js-beautify").js_beautify;

module.exports = {
    find: function(req, res) {
        var catalogs = [];
        SpoofApi.find({
            story: req.params.storyid
        }).select('story catalog content').exec(function(err, docs) {
            if (err) return handleError(err);

            docs.forEach(function(doc, index) {
                catalogs.push({
                    idx: index,
                    story: doc.story,
                    catalog: doc.catalog,
                    content: doc.content ? JSON.stringify(doc.content).substr(0, 300) : ""
                });
            });

            if (catalogs.length == 0) {
                res.redirect('/add/' + req.params.storyid);
            } else {
                res.render('story', {
                    storyid: req.params.storyid,
                    catalogs: catalogs
                });
            }
        });
    },

    save: function(req, res) {
        var content = req.body.content;
        var tobj = new SpoofApi({
            story: req.params.storyid,
            catalog: req.body.catalog,
            content: JSON.parse(content)
        });

        this.findOne(req, res, function( err, doc){
            if(!doc) {
                tobj.save(function(err){
                    if (err) 
                    {
                        req.session.error = err.message;
                    }

                    res.redirect('/story/' + req.params.storyid);
                });

            } else {
                SpoofApi.update({story: req.params.storyid, catalog: req.body.catalog},{content: JSON.parse(content)
                    },function(err) {
                        if (err) 
                        {
                            req.session.error = err.message;
                        }
                    res.redirect('/story/' + req.params.storyid);
                });
            }
        });  
    },

    findByCatalog: function(req, res) {
        this.findOne(req, res, function(err, doc){
            if(doc === null){
               return res.send('no api');
            }
            var content = doc.content;

            res.render('updatecatalog', {
                storyid: req.params.storyid,
                catalog: req.params.catalog,
                content: content ? beautify(JSON.stringify(content), { indent_size: 2 })  : '',
                jsonurl: '/story/' + req.params.storyid + "/" + req.params.catalog + "/api",
                jsonpurl: '/story/' + req.params.storyid + "/" + req.params.catalog + "/api?jsoncallback=fromspoof"
            });
        });
    },

    showApi: function(req, res){

        var query = url.parse(req.url).query;
        var queryData = qs.parse(query);
        var jsoncallback = "jsoncallback";
        var isJSONP = queryData[jsoncallback] ? true: false;

        this.findOne(req, res, function(err, doc){
            if(doc === null){
               return res.send('no api');
            }

            if(isJSONP){
              res.writeHead(200, {'Content-Type': 'application/javascript'});
              res.write(queryData[jsoncallback]+'('+ JSON.stringify(doc.content) + ')');
            }
            else{
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(doc.content));
            }
            res.end();
        });
    },

    findOne: function(req, res, callback) {
        SpoofApi.findOne({
            story: req.params.storyid,
            catalog: req.params.catalog || req.body.catalog
        }).select('content').exec(function(err, doc){
            if (err) {
                req.session.error = err.message;
            }
            callback(err, doc);
        });
    }
};