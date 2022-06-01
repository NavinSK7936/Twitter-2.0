$(function() {

    callDestructor();

    var pageNo = 0;
    var pageSize = 10;
    var minTS = getTimestampFormattedValue(new Date());

    setTopAppBar({ title: 'Home', showBackButton: false })

    
    function loadMore() {

        const user_id = getCurrentUserIdInLS();

        $.ajax({
            url: base_url + "tweet/rfeeds?user_id=" + user_id +"&minTs=" + minTS + "&size=" + pageSize + "&start=" + pageNo + "",
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(tweetPieces) {

                if (tweetPieces == null || tweetPieces.length == 0) {
                    console.log("END REACHED DA!!! NO MORE TWEETS!!!!");
                    endReached();
                    return;
                }

                for (const tweetPiece of tweetPieces) {

                    if (tweetPiece['type'] == "QUOTED")
                        $('#home-feeds-container').append(getQuotedRetweet(tweetPiece['parent'], tweetPiece['child']));
                    else if (tweetPiece['type'] == "RETWEET")
                        $('#home-feeds-container').append(getRetweet(user_id, tweetPiece['parent'], tweetPiece['child']));
                    else if (tweetPiece['type'] == "REPLY")
                        $('#home-feeds-container').append(getReply(tweetPiece['parent'], tweetPiece['child']));
                    else
                        $('#home-feeds-container').append(getSingleTweetForSecondColumnTweetsContainer(tweetPiece['child']['tweet'], tweetPiece['child']['user']));
                    
                }

                pageNo += pageSize;

            }, error: function(request, status, error) {
                console.log('setHomePage', request.responseText, status, error);
            }, complete: function() {
            }
        })
    }

    const observer = respondToVisibility(document.getElementById('homeFeedsSpinnerId'), visibile => {
        if (!visibile)
            return;

        loadMore();
        
    })

    function endReached() {
        $('#second-body').append(
        `
            <div>
                <p>END</p>
            </div>
        `);
        $('#homeFeedsSpinnerId').hide();
        observer.disconnect();
    }

})