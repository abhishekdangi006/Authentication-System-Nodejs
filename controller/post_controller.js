const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');


// Creating the user post
module.exports.create = async function(req , res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            })
        }
        req.flash('success', 'Post has been uploaded!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}


// Deleting the user post
module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        // .id means converting the object id into string
        if(post.user == req.user.id){

            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}})

            post.remove();
            
            await Comment.deleteMany({post: req.params.id});              

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                    })
            }
            
            req.flash('success', 'Post has been deleted!');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}