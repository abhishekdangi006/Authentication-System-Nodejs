const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comment_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content : req.body.content,
                user : req.user._id,
                post : req.body.post 
            });
                post.comments.push(comment);
                post.save();

                comment = await comment.populate('user', 'name email').execPopulate();
                // commentsMailer.newComment(comment);
                let job = queueMicrotask.create('emails', comment).save(function(err){
                    if(err){
                        console.log('error in creating a queue');
                    }

                    console.log(job.id);
                });

                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            comment: comment
                        },
                        message: "Post created!"
                    });
                }

                req.flash('success', 'commented successfully!');
                res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        // .id means converting the object id into string
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();

        let post = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            req.flash('success', 'Comment deleted success.');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        res.redirect('back');
    }
}