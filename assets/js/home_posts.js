{
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/post/create',
                data: newPostForm.serialize() ,
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    new toggleLike($('.toggle-like-button', newPost));
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    //method to create in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}" class="user-post">
            <p>
                <small class="user-name"><a href="/users/profile/${post.user._id}"><i class="fas fa-user-circle"></i> ${post.user.name}</a></small>
                <small class="delete"><a class="delete-post-button" href="/post/destroy/${post._id}"><i class="fa-solid fa-trash"></i></a></small>
                <br>
                ${post.content }
                <br>
                <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                0 Likes
                </a>
            </p>
            <div class="post-comments">
                <div class="post-comment-list">
                    <h4>Comments:</h4>
                    <ul id="post-comments-${post._id}">
                    </ul>
                </div>
                    <div id="comment-form">
            <form action="/comment/create" method="POST">
                <input type="text" name="content" placeholder="comment here..." required>
                <input type="hidden" name="post" value="${post._id}">
                <button type="submit"Comment>Comment</button>
            </form>
        </div>
        </div>
        </li>`);
    }

//method to delete a post from DOM
let deletePost = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
            },error: function(error){
                console.log(error.responseText);
            }
        });
    });
}

    createPost();
}