var SpoofApi = require('../models/spoofapi');
var qs = require('querystring');
var url = require('url');
var beautify = require("js-beautify").js_beautify;

module.exports = {
    find: function(req, res) {
        var catalogs = [];
        var story = req.params.storyid;

        this.findAll(req, res, function(err, docs) {
            docs.forEach(function(doc, index) {
                catalogs.push({
                    idx: index,
                    story: doc.story,
                    catalog: doc.catalog,
                    content: doc.content ? JSON.stringify(doc.content).substr(0, 300) : ""
                });
            });

            if (catalogs.length == 0) {
                res.set('Content-Type', 'text/html');
                res.send(new Buffer("<!doctype html>" +
                    "<html>" +
                    "<head>" +
                    "<title>tips</title>" +
                    "</head>" +
                    "<body>" +
                    "<div>there is no api in this story now, you can <a href='/add/" + story + "'>add</a> one.</div>" +
                    "</body>" +
                    "</html>"));
                //res.redirect('/add/' + req.params.storyid);
            } else {
                res.render('story', {
                    storyid: story,
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

        this.findOne(req, res, function(err, doc) {
            if (!doc) {
                tobj.save(function(err) {
                    if (err) {
                        req.session.error = err.message;
                    }

                    res.redirect('/story/' + req.params.storyid);
                });

            } else {
                SpoofApi.update({
                    story: req.params.storyid,
                    catalog: req.body.catalog
                }, {
                    content: JSON.parse(content)
                }, function(err) {
                    if (err) {
                        req.session.error = err.message;
                    }
                    res.redirect('/story/' + req.params.storyid);
                });
            }
        });
    },

    findByCatalog: function(req, res) {
        this.findOne(req, res, function(err, doc) {
            if (doc === null) {
                return res.send('no api');
            }
            var content = doc.content;

            res.render('updatecatalog', {
                storyid: req.params.storyid,
                catalog: req.params.catalog,
                content: content ? beautify(JSON.stringify(content), {
                    indent_size: 2
                }) : '',
                jsonurl: '/story/' + req.params.storyid + "/" + req.params.catalog + "/api",
                jsonpurl: '/story/' + req.params.storyid + "/" + req.params.catalog + "/api?jsoncallback=fromspoof"
            });
        });
    },

    showApi: function(req, res) {

        var query = url.parse(req.url).query;
        var queryData = qs.parse(query);
        var jsoncallback = "jsoncallback";
        var isJSONP = queryData[jsoncallback] ? true : false;

        this.findOne(req, res, function(err, doc) {
            if (doc === null) {
                return res.send('no api');
            }

            if (isJSONP) {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript;charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write(queryData[jsoncallback] + '(' + JSON.stringify(doc.content) + ')');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write(JSON.stringify(doc.content));
            }
            res.end();
        });
    },

    findOne: function(req, res, callback) {
        SpoofApi.findOne({
            story: req.params.storyid,
            catalog: req.params.catalog || req.body.catalog
        }).select('content').exec(function(err, doc) {
            if (err) {
                req.session.error = err.message;
            }
            callback(err, doc);
        });
    },

    findAll: function(req, res, callback) {
        SpoofApi.find({
            story: req.params.storyid
        }).select('story catalog content').exec(function(err, docs) {
            if (err) {
                req.session.error = err.message;
            }

            callback(err, docs);
        });
    },

    addCatalog: function(req, res) {
        var originArr = ["01", "02", "03", "04", "05", "06", "07", "08", "09","10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"];
        this.findAll(req, res, function(err, docs) { 
            docs.forEach(function(doc, index) {
                var catalog = doc.catalog;
                var tryFindIndex = originArr.indexOf(catalog);
                if(tryFindIndex > -1) {
                    originArr.splice(tryFindIndex, 1);
                }
            });

            res.render("addcatalog", {
                storyid: req.params.storyid,
                catalogs: originArr.splice(0, 10),
                message: '<div class="alert alert-error">' + "最多只能创建100个api" + '</div>'
            });
        });
    }
};