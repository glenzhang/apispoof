var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SpoofApiSchema = new Schema({

    story : String,

    catalog: String,

    content: Schema.Types.Mixed

}, {collection: "spoofapi"});

module.exports = mongoose.model("SpoofApi", SpoofApiSchema);