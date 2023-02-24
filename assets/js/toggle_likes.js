class toggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied , it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data){
                let likeCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if(data.data.deleted == true){
                    likesCount -= 1;
                }else{
                    likesCount += 1;
                }

                $(self).attr('data-likes', likeCount);
                $(self).html(`${likesCount} likes`);
            })
            .fail(function(errData){
                console.log("Error in completing the request");
            });
        });
    }
}