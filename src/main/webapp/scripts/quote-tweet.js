$(function() {

    var controller = {
        pageNo: 0,
        pageSize: 5
    };

    const uri = decodeURIComponent(window.location.search);
    const qp = getQueryKVMap(uri);

    controller.tweet_id = qp.get('id');

    const tweetInfoRLObserver = respondToVisibility(document.getElementById('quote-tweet-q-spinner'), visibile => {

        if (!visibile)
            return;

        loadMoreQuoteTweets(controller);
        
    })

})


function loadMoreQuoteTweets(controller) {

    $.ajax({
        url: base_url + `tweet/retweet/users?tweet_id=${controller.tweet_id}&after_user_id=${controller.after_user_id}&page=${controller.pageNo}&size=${controller.pageSize+1}`,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(users) {

            for (const user of users.slice(0, users.length > controller.pageSize ? -1 : undefined)) {
            
                controller.after_user_id = user['id'];
                $('#tweet-info-rl-container').append(getUserProfileTweetInfoCell(user, controller.tweet_id));
            
            }

            controller.pageNo += controller.pageSize;

            if (users.length <= controller.pageSize)
                $('#tweet-info-rl-container').append(`<div style="height: 500px;"></div>`);
            else
                showUI($('#tweet-info-rl-spinner'));


        }, error: function(request, status, error) {
            console.log('loadMoreForRLTweetInfo-retweets', request.responseText, status, error);
        }, complete: function() {
        }
    })
    
}