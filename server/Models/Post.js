const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({

    title : { type: String, required: true },
    description : { type: String },
    location : { type: String },
    likesCount : {type: Number, default: 0},
    commentsCount: {type: Number, default: 0},
    peopleTags: [String],
    postedDate: {type:Date, default: Date.now()},

})

const Post = new mongoose.model('Post', postSchema);

module.exports = Post;