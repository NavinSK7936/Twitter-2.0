function replyClicked(element, tweet_id) {
    console.log('replyClicked');
}

function alterLikeIconDiv(element, reply_count) {

    if ($(element).data('isclicked')) {
        $(element).css('color', '');
        $(element).find('#count').text(reply_count);
    }
    else {
        $(element).css('color', '#fa2c8b');
        $(element).find('#count').text(reply_count);
    }

    $(element).data('isclicked', !$(element).data('isclicked'));

}

function likeClicked(element, tweet_id) {

    // doSomethingInBG and get Result as like_count;
    $.ajax({
        url: base_url + "tweet/likes?tweet_id=" + tweet_id + "&user_id=" + getCurrentUserIdInLS(),
        type: "POST",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        data: JSON.stringify({ value: $(element).data('isclicked') ? -1 : 1 }),
        timeout: 2500,
        success: function(res) {
            console.log(($(element).data('isclicked') ? "un" : "") + "liked", res);
        }, error: function(request, status, error) {
            console.log('likeClicked: ', request.responseText, status, error);
        }, complete: function() {
        }
    })
    // $.post(
    //     base_url + "tweet/likes?tweet_id=" + tweet_id + "&user_id=" + getCurrentUserIdInLS(),
    //     {
    //         value: $(element).data('isclicked') ? -1 : 1
    //     }, function(data, status) {
    //         console.log('op', data, status);
    //     })

    var like_count = parseInt($(element).find('#count').text()) + ($(element).data('isclicked') ? -1 : 1);

    alterLikeIconDiv(element, like_count);

}

function alterRetweetIconDiv(element, reply_count) {

    if ($(element).data('isclicked')) {
        $(element).css('color', '');
        $(element).find('#count').text(reply_count);
    }
    else {
        $(element).css('color', '#10d795');
        $(element).find('#count').text(reply_count);
    }

    $(element).data('isclicked', !$(element).data('isclicked'));

}

function retweetClicked(element, event, tweet_id) {
    // doSomethingInBG and get Result as retweet_count;
    // var retweet_count = parseInt($(element).find('#count').text()) + ($(element).data('isclicked') ? -1 : 1);

    // alterRetweetIconDiv(element, retweet_count);

    event.stopPropagation();

    console.log(event.clientX, event.clientY, element);

    $('#retweetClickMenuId').css('left', event.clientX);
    $('#retweetClickMenuId').css('top', event.clientY);

    $('#retweetClickMenuId').data('onclick', true);
    $('#retweetClickMenuId').css('display', 'block');
    $('#retweetClickMenuId').css('display', '');

}

function shareClicked(tweet_id) {
    console.log('shareClicked');
}
