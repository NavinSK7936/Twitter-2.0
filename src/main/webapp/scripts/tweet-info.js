
function tweetInfoWhoCanReplyChoiceClikced(choice, tweet_id) {

    console.log(tweet_id, choice);
    
    $('#tweet-info-who-can-reply-main-icon').removeClass();
    $('#tweet-info-who-can-reply-main-icon').addClass(whoCanReplyIconsTweetInfo[choice]);

    $('#tweet-info-who-can-reply-string').text(whoCanReplyStrings[choice] + ' can reply');
    $('#tweet-info-who-can-reply').attr('data-who-can-reply-choice', choice);

    $.ajax({
        url: base_url + "tweet/who_can_reply?tweet_id=" + tweet_id + "&choice=" + choice,
        type: "PATCH",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(res) {
        }, error: function(request, status, error) {
            console.log('tweets-info-actual-tweets', request.responseText, status, error);
        }, complete: function() {
        }
    })

}

var tweetInfoRepliesSpinner = null;

$(function() {
    
    console.log(window.location.search);

    callDestructor(function() {
        $('#tweet-info-relevant-people-third-box').remove();
    });


    const uri = decodeURIComponent(window.location.search);
    const qp = getQueryKVMap(uri);

    const tweet_id = qp.get('id');

    var minTS, pageNo = 0, pageSize = 5;

    $.ajax({
        url: base_url + "tweet/parent/tweets?tweet_id=" + tweet_id,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(tweetboxes) {

            setTopAppBar({ title: tweetboxes.length ? 'Thread' : 'Tweet', showBackButton: true });

            var relevantUsers = new Set();

            for (const tweetbox of tweetboxes) {

                relevantUsers.add(tweetbox['user']['id']);
                tweetbox['tweet']['mentions'].forEach(item => relevantUsers.add(item));
                
                $('#tweet-info-parent-tweets-container').append(getParentReplyForTweetInfo(tweetbox));

            }



            $.ajax({
                url: base_url + "tweet/tweetbox?tweet_id=" + tweet_id,
                type: "GET",
                contentType: "application/json; charSet=UTF-8",
                dataType: "json",
                timeout: 2500,
                success: function(tweetbox) {

                    relevantUsers.add(tweetbox['user']['id']);
                    tweetbox['tweet']['mentions'].forEach(item => relevantUsers.add(item));

                    showRelevantUsersForTweetInfo(relevantUsers);
        
                    var replyingTo = tweetboxes.length && tweetboxes[tweetboxes.length-1]['user']['id'] != tweetbox['user']['id'] ? {
                        mention_name: tweetboxes[tweetboxes.length-1]['user']['mention_name'],
                        id: tweetboxes[tweetboxes.length-1]['user']['id']
                    } : null;

                    $('#tweet-info-parent-tweets-container').after(getActualTweetForTweetInfo(tweetbox, replyingTo, tweetboxes.length == 0 && tweetbox['user']['id'] == getCurrentUserIdInLS()));


                    tweetInfoWhoCanReplyChoiceClikced(tweetbox['tweet']['who_can_reply'], tweetbox['tweet']['id']);


                    // To set retweets if exists
                    $.ajax({
                        url: base_url + "tweet/parent/retweet?retweet_id=" + (tweetboxes.length ? tweetboxes[0] : tweetbox)['tweet']['id'],
                        type: "GET",
                        contentType: "application/json; charSet=UTF-8",
                        dataType: "json",
                        timeout: 2500,
                        success: function(parentbox) {

                            if (parentbox == null)
                                return;
                            
                            else if (tweetboxes.length == 0 && parentbox['tweet']['quote'] == null)

                                $('#tweet-info-parent-tweets-container').before(`
                                    <div onclick="takeToUserProfile(${parentbox['user']['id']})" style="display: flex; align-items: center; text-align: center; margin-left: 5px; margin-bottom: 5px;">
                                        <i class="fa fa-retweet" style="font-size: 16px; color: rgb(111, 109, 106);"></i>
                                        <div style="color: rgb(111, 109, 106); margin-left: 5px;">${parentbox['user']['id'] == +getCurrentUserIdInLS() ? 'You' : parentbox['user']['user_name']} Retweeted</div>
                                    </div>
                                `);

                            else

                                if (tweetboxes.length)
                                    getNthGrandChild($('#tweet-info-parent-tweets-container'), 0, 0, 1, 0, 0).append(getRetweetDivForFirstTweet(parentbox, false));
                                
                                else
                                    $('#tweet-info-parent-tweets-container').next().children().eq(1).after(getRetweetDivForFirstTweet(parentbox, true));
                            

                        }, error: function(request, status, error) {
                            console.log('tweets-info-get-parent-if-retweet', request.responseText, status, error);
                        }, complete: function() {
                        }
                    })


                    minTS = getTimestampFormattedValue(new Date());

                    tweetInfoRepliesSpinner = respondToVisibility(document.getElementById('tweet-info-replies-spinner'), visible => {
                    
                        if (!visible)
                            return;
                        
                        $.ajax({
                            url: base_url + `tweet/replies/tweets?tweet_id=${tweetbox['tweet']['id']}&minTs=${minTS}&start=${pageNo}&size=${pageSize+1}` ,
                            type: "GET",
                            contentType: "application/json; charSet=UTF-8",
                            dataType: "json",
                            timeout: 2500,
                            success: function(replies) {

                                for (const replybox of replies.slice(0, replies.length > pageSize ? -1 : undefined))
                                    $('#tweet-info-replies').append(getReplyDivForActualTweet(replybox));
                                
                                pageNo += pageSize;

                                if (replies.length <= pageSize) {
                                    showUI($('#tweet-info-replies-spinner'), false);
                                    $('#tweet-info-replies').append(
                                        replies.length ?
                                        getContentEndPlaceholder(endReachedTitles) :
                                        getContentEmptyPlaceholder({
                                            title: "NO REPLIES MADE",
                                            subTitle: "Be the first one to reply!"
                                        })
                                    );
                                }
                                
                            }, error: function(request, status, error) {
                                console.log('tweets-info-get-parent-if-retweet', request.responseText, status, error);
                            }, complete: function() {
                            }
                        })

                    })


        
                }, error: function(request, status, error) {
                    console.log('tweets-info-actual-tweets', request.responseText, status, error);
                }, complete: function() {
                }
            })

        }, error: function(request, status, error) {
            console.log('tweets-info-parent-tweets', request.responseText, status, error);
        }, complete: function() {
        }
    })



})



function getActualTweetForTweetInfo(tweetbox, replyingTo, showWhoCanReply) {

    const dateTime = get12hrFormattedDateTime(tweetbox['tweet']['created_at']);

    return `
        <div style="margin-bottom: 20px;">

            <div style="display: flex;">
                <div>
                    <img onclick="takeToUserProfile(${tweetbox['user']['id']})" style="width: 50px; height: 50px; border-radius: 50%; border: 1px solid black;" src="images/icon_doge.jpeg" alt="User Icon">
                </div>
                <div style="display: block; margin-left: 12px; cursor: pointer;">
                    <div onclick="takeToUserProfile(${tweetbox['user']['id']})" style="font-size: 16px; font-weight: 600;">${tweetbox['user']['user_name']}</div>
                    <div onclick="takeToUserProfile(${tweetbox['user']['id']})" style="font-size: 15px; font-weight: 400; margin-top: -3px; color: rgb(110, 110, 110);">@${tweetbox['user']['mention_name']}</div>
                </div>
            </div>

            ${replyingTo == null ? `` : `
                <div style="display: block; font-size: 13px; font-weight: 500; color: rgb(110, 110, 110); margin-top: 10px; margin-left: 5px;">
                    Replying to <span onclick="takeToUserProfile(${replyingTo['id']})" style="color: rgb(29, 155, 240); cursor: pointer;">@${replyingTo['mention_name']}</span>
                </div>
            `}

            <div style="margin-top: 15px; margin-left: 5px; margin-right: 5px; font-size: 20px;">
                ${getResultWithHashtags(tweetbox['tweet']['quote'])}
            </div>

            <!-- Who can reply -DIV -->
            ${showWhoCanReply ? getWhoCanReplyIcon(tweetbox['tweet']['id']) : ``}

            <div style="display: block;">

                <div style="display: flex; margin: 20px 10px 15px; color: rgb(110, 110, 110); font-weight: 450; align-items: center;">
                
                    <div>
                        <span style="margin-right: 3px;">${dateTime.time}</span>
                        <span style="margin-right: 3px;">·</span>
                        <span style="margin-right: 3px;">${dateTime.date}</span>
                        <span style="margin-right: 6px;">·</span>
                        <span style="margin-right: 4px;">${sourceLabels[tweetbox['tweet']['source_label']]}</span>
                    </div>
                    
                </div>

                ${getRQTweetInfo(tweetbox['tweet']['id'], tweetbox['tweet']['total_likes'])}

                <hr style="margin: 0 -10px 15px; border: 1px solid black;">
                <div style="padding-left: 25px; padding-bottom: 20px; padding-top: 5px;">
                    ${getqqqqTweetInfo(tweetbox['tweet'], tweetbox['user'])}
                </div>

            </div>
            <hr style="margin: 0 -10px 15px; border: 1px solid black;">

        </div>
    `
}

function getRQTweetInfo(tweet_id, like_count) {

    var ans = ``;

    $.ajax({
        url: base_url + "tweet/rq?tweet_id=" + tweet_id,
        type: "GET",
        async: false,
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(rq) {

            if (like_count + rq[0] + rq[1] == 0)
                return;

            ans = `
                <div>
                    <hr style="margin-top: 15px; margin-bottom: 0px;">
                    <div style="display: flex; align-items: center; margin: 15px 10px;">
                        ${rq[0] == 0 ? `` : `
                            <div onclick="showWhoRetweeted(${tweet_id})" style="margin-right: 20px; cursor: pointer;">
                                <span style="font-size: 16px; font-weight: 600;">${rq[0]}</span> <span style="font-size: 14px; color: rgb(107, 104, 99);">Retweet${rq[0] == 1 ? `` : `s`}</span>
                            </div>
                        `}

                        ${rq[1] == 0 ? `` : `
                            <div onclick="showQuotedTweets(${tweet_id})" style="margin-right: 20px; cursor: pointer;">
                                <span style="font-size: 16px; font-weight: 600;">${rq[1]}</span> <span style="font-size: 14px; color: rgb(107, 104, 99);">Quote${rq[1] == 1 ? `` : `s`}</span>
                            </div>
                        `}

                        ${like_count == 0 ? `` : `
                            <div onclick="showWhoLiked(${tweet_id})" style="cursor: pointer;">
                                <span style="font-size: 16px; font-weight: 600;">${like_count}</span> <span style="font-size: 14px; color: rgb(107, 104, 99);">Like${like_count == 1 ? `` : `s`}</span>
                            </div>
                        `}
                    </div>
                </div>
            `

        }, error: function(request, status, error) {
            console.log('tweets-info-tweets-rq', request.responseText, status, error);
        }, complete: function() {
        }
    })

    return ans;
}

function getParentReplyForTweetInfo(tweetbox) {
    return `
        <div style="display: block; margin-bottom: 5px;">
            <div style="display: block; margin-bottom: -2px;">

                <div style="display: flex; margin-bottom: 3px;">
                    <div style="margin-right: 10px; background: white; padding-bottom: 3px;">
                        <div style="cursor: pointer;">
                            <img onclick="takeToUserProfile(${tweetbox['user']['id']})" style="width: 50px; height: 50px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                        </div>
                    </div>
                    <div style="display: flex; margin-top: -20px; align-items: center; margin-bottom: 3px;">
                        <div style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
                            <span onclick="takeToUserProfile(${tweetbox['user']['id']})">${tweetbox['user']['user_name']}</span>
                        </div>
                        <div onclick="takeToUserProfile(${tweetbox['user']['id']})" style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                            <span>@</span><span>${tweetbox['user']['mention_name']}<span>
                        </div>
                        <span aria-hidden="true" style="margin: 0px 5px;">
                            <span>·</span>
                        </span>
                        <div class="remove-link-underline tweet-time-span">
                            <span>${getTimeSpanFromNow(tweetbox['tweet']['created_at'])}</span>
                        </div>
                    </div>
                </div>


                <div style="margin-left: 25px; margin-top: -20px; width: 100%; padding-right: 25px;">
                    
                    <div style="padding-left: 1px; border-left: 1.7px solid rgb(160, 160, 160); min-height: 40px;">
                        <div style="padding-left: 32px; margin-top: -25px;">
                            <div onclick="showTweet(${tweetbox['tweet']['id']})" 
                                style="cursor: pointer; word-break: break-all; padding-bottom: 10px; font-size: 16px;">
                                ${getResultWithHashtags(tweetbox['tweet']['quote'])}
                            </div>
                        </div>

                        <div style="padding-left: 25px; padding-bottom: 15px;">
                            ${getqqqq(tweetbox['tweet'], tweetbox['user'])}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    `
}