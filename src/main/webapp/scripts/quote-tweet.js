$(function() {

    callDestructor();

    setTopAppBar({ title: 'Quoted Tweets', showBackButton: true });

    var controller = {
        pageNo: 0,
        pageSize: 5
    };

    const uri = decodeURIComponent(window.location.search);
    const qp = getQueryKVMap(uri);

    controller.tweet_id = qp.get('id');
    controller.minTs = getTimestampFormattedValue(new Date());

    $.ajax({
        url: base_url + `tweet/tweetbox?tweet_id=${controller.tweet_id}`,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(quotedBox) {

            controller.quotedBox = quotedBox;

            respondToVisibility(document.getElementById('quote-tweet-q-spinner'), visibile => {

                if (!visibile)
                    return;
        
                loadMoreQuoteTweets(controller);
                
            })

        }, error: function(request, status, error) {
            console.log('loadMoreQuoteTweets-quotes', request.responseText, status, error);
        }, complete: function() {
        }
    })

})


function loadMoreQuoteTweets(controller) {

    showUI($('#quote-tweet-q-spinner'), false);

    $.ajax({
        url: base_url + `tweet/quotes?tweet_id=${controller.tweet_id}&minTs=${controller.minTs}&page=${controller.pageNo}&size=${controller.pageSize+1}`,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(tweetboxes) {

            for (const tweetbox of tweetboxes.slice(0, tweetboxes.length > controller.pageSize ? -1 : undefined))
            
                $('#quote-tweet-q-container').append(getQuotedRetweet(controller.quotedBox, tweetbox));
            

            controller.pageNo += controller.pageSize;

            if (tweetboxes.length <= controller.pageSize) {
                showUI($('#quote-tweet-q-spinner'), false);
                $('#quote-tweet-q-container').append(getContentEndPlaceholder({
                    title: 'REACHED THE END',
                    subTitle: ''
                }));
            } else
                showUI($('#quote-tweet-q-spinner'));


        }, error: function(request, status, error) {
            console.log('loadMoreQuoteTweets-quotes', request.responseText, status, error);
        }, complete: function() {
        }
    })

}