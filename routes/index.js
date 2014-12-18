/*
 * GET home page.
 */
var story = require('./story');

exports.index = function(req, res) {
    res.render('index', {
        title: 'apispoof'
    });
};

exports.story = function(req, res) {
    if (req.params.catalog) {
        return story.findByCatalog(req, res);;
    }

    if (!req.params.storyid) {
        return res.send('story');
    }

    story.find(req, res);
};

exports.api = function(req, res){
    story.showApi(req, res);
};

exports.catalog = function(req, res) {
    story.addCatalog(req, res);
};

exports.doStory = function(req, res){
    story.save(req, res);
};

exports.doCatalog = function(req, res){
    story.save(req, res);
};