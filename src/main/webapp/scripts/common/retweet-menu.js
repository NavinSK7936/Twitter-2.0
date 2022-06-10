
function retweetMenuItemsClick(element, tweet_id, event) {

    element = $(element)
    // event.stopPropagation();

    let tweetBox = {};

    if (element.data('retweet-type') == 'retweet') {

        element.data('isRetweeted', !element.data('isRetweeted'));
        element.parent().parent().children().first().toggleClass('retweet-qqqq-color');
        element.parent().parent().children().first().children().eq(1).text(+element.parent().parent().children().first().children().eq(1).text() + (element.data('isRetweeted') ? 1 : -1));

        if (element.data('isRetweeted')) {
            $(element.children().eq(1).children()).text('Undo Retweet');

            $.ajax({
                url: base_url + 'tweet/retweet?parent_tweet_id=' + tweet_id,
                type: "POST",
                contentType: "application/json; charSet=UTF-8",
                data: JSON.stringify({ "user_id": getCurrentUserIdInLS() }),
                dataType: "json",
                timeout: 2500,
                success: function(res) {
                    console.log('retweet:', res);
                }, error: function(request, status, error) {
                    console.log('retweet-type: ', request.responseText, status, error);
                }, complete: function() {
                }
            })

        } else {
            $(element.children().eq(1).children()).text('Retweet');

            $.ajax({
                url: base_url + 'tweet/undo/retweet?parent_tweet_id=' + tweet_id + "&user_id=" + getCurrentUserIdInLS(),
                type: "DELETE",
                contentType: "application/json; charSet=UTF-8",
                dataType: "json",
                timeout: 2500,
                success: function(res) {
                    console.log('undo done:', res);
                }, error: function(request, status, error) {
                    console.log('retweet-undo-type: ', request.responseText, status, error);
                }, complete: function() {
                }
            })

        }

    } else {

        $.ajax({
            url: base_url + "tweet/id/" + tweet_id,
            type: "GET",
            async: false,
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(tweet) {
                tweetBox['tweet'] = tweet;
                $.ajax({
                    url: base_url + "user/id/" + tweet['user_id'],
                    type: "GET",
                    async: false,
                    contentType: "application/json; charSet=UTF-8",
                    dataType: "json",
                    timeout: 2500,
                    success: function(user) {
                        tweetBox['user'] = user;
                    }, error: function(request, status, error) {
                        console.log('error:: retweetMenuItemsClick-user: ' + mentionId, request.responseText, status, error);
                    }, complete: function() {
                    }
                })
            }, error: function(request, status, error) {
                console.log('error:: retweetMenuItemsClick-tweet: ' + mentionId, request.responseText, status, error);
            }, complete: function() {
            }
        })

        console.log(tweetBox);

        showTopLayerTweet(undefined, tweetBox);

    }

}