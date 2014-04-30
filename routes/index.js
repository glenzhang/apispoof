/*
 * GET home page.
 */
var story = require('./story');

exports.index = function(req, res) {
    res.render('index', {
        title: 'FE-Helper'
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

exports.doStory = function(req, res){
    story.save(req, res);
};

exports.api = function(req, res){
    story.showApi(req, res);
};

exports.doCatalog = function(req, res){
    story.save(req, res);
};