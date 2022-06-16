function getqqqqTweetInfo(tweet, user) {

    let ans = null;

    $.ajax({
        url: base_url + "tweet/iqqt?user_id=" + getCurrentUserIdInLS() + "&tweet_id="+ tweet['id'],
        type: "GET",
        async: false,
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(res) {

            const isRetweeted = res & 2, isLiked = res & 1;

            ans = `
                <div class="tweet-tool-icons" role="group" style="display: flex; align-items: center; margin: -5px 0;">` +
                    getReplyIconDivForTweetInfo(tweet['id'], user['id']) +
                    getRetweetIconDivForTweetInfo(tweet['id'], isRetweeted) +
                    getLikeIconDivForTweetInfo(tweet['id'], isLiked) +
                    getShareIconDivForTweetInfo(tweet['id']) + `
                </div>
            `;

        }, error: function(request, status, error) {
            console.log('getqqqqTweetInfo: ' + tweet['id'] + "," + user['id'], request.responseText, status, error);
        }, complete: function() {
        }
    })

    return ans;
}

function getReplyIconDivForTweetInfo(tweet_id, user_id) {

    var ans = `
        <div onclick="replyClicked(${user_id}, ${tweet_id})" style="cursor: pointer; display: flex;">
            <i class="fa fa-reply" style="font-size: 22px;" aria-hidden="true"></i>
        </div>
    `;

    $.ajax({
        url: base_url + `tweet/can_reply?tweet_id=${tweet_id}&user_id=${getCurrentUserIdInLS()}`,
        type: "GET",
        async: false,
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(can_reply) {

            if (!can_reply)
                ans = `
                    <div class="tooltip-9"
                        style="cursor: no-drop; display: flex; justify-content: center; align-items: center; position: relative;">
            
                        <span class="tooltip-item-9"
                            style="font-style: italic; font-weight: 550; position: absolute; top: -250%; background-color: white; padding: 8px 10px; box-shadow: rgb(12 114 200) 0px 0px 20px; border: 1px solid rgb(12, 114, 200); border-radius: 5px; overflow: hidden; white-space: nowrap;">
                            You're not allowed to reply
                        </span>
            
                        <i class="fa fa-reply" style="font-size: 22px; opacity: .4;" aria-hidden="true"></i>
            
                    </div>
                `
            
        }, error: function(request, status, error) {
            console.log('getReplyIconDivForTweetInfo-can_reply', request.responseText, status, error);
        }, complete: function() {
        }
    })

    return ans;
}

function getRetweetIconDivForTweetInfo(tweet_id, isRetweeted) {
    return `
        <div class="dropdown" data-type="retweetIconDivQQQQ">
            <div id="retweet-dropdown-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                ` + (isRetweeted ? ` class="retweet-qqqq-color" ` : ``) + `
                style="cursor: pointer; display: flex;">
                <i class="fa fa-retweet" style="font-size: 24px;"></i>
            </div>
            <div class="dropdown-menu" aria-labelledby="retweet-dropdown-menu" style="background-color: white; border: 1px solid black; border-radius: 15px;
                -webkit-box-shadow:0 0 20px rgb(12, 114, 200); 
                -moz-box-shadow: 0 0 20px rgb(12, 114, 200); 
                box-shadow: 0 0 20px rgb(12, 114, 200);">

                <div data-retweet-type="retweet" style="cursor: pointer; display: flex; margin: 11px 13px; margin-bottom: 15px;"
                    data-is-retweeted="${isRetweeted}"
                    onclick="retweetMenuItemsClick(this, ${tweet_id}, event)">
                    <div style="margin-right: 10px;">
                        <i style="font-size: 22px;" class="fa fa-retweet"></i>
                    </div>
                    <div style="display: flex;">
                        <div class="center-text-vertically" style="text-align: center; font-size: 15px;">` + (isRetweeted ? "Undo " : "") + `Retweet</div>
                    </div>
                </div>

                <div data-retweet-type="quote" style="cursor: pointer; display: flex; margin: 11px 13px; margin-top: 25px;"
                    onclick="retweetMenuItemsClick(this, ${tweet_id}, event)">
                    <div style="margin-left: 5px; margin-right: 11px;">
                        <i style="font-size: 22px;" class="fa fa-pencil"></i>
                    </div>
                    <div style="display: flex;">
                        <div class="center-text-vertically" style="text-align: center; font-size: 15px;">Quote Tweet</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getLikeIconDivForTweetInfo(tweet_id, isLiked) {
    return `
        <div data-isclicked="${isLiked}" onclick="likeClicked(this, ${tweet_id})" style="cursor: pointer; display: flex; ${(isLiked ? "color: #fa2c8b" : "")};">
            <i class="fa fa-heart" style="font-size: 22px;"></i>
        </div>
    `;
}


function getShareIconDivForTweetInfo(tweet_id) {
    return `
        <div onclick="shareClicked(${tweet_id})" style="font-size: 22px; cursor: pointer; display: flex;">
            <i class="fa fa-share"></i>
        </div>
    `;
}


function getWhoCanReplyIcon(tweet_id) {
    return `
        <div style="display: flex; align-items: center; margin: 10px 0 -10px;">
            <div style="margin-left: 5px;">
                <div id="tweet-info-who-can-reply-div" class="dropdown" style="display: block;">
                    <div id="tweet-info-who-can-reply" data-who-can-reply-choice="0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        class="dropdown-toggle"
                        data-isclicked="isRetweeted" style="position: relative; cursor: pointer; display: flex; color: rgb(29, 155, 240); display: inline-flex;">
                        
                        <i id="tweet-info-who-can-reply-main-icon" class="ri-earth-fill" style="color: rgb(29, 155, 240); position: relative;
                                        font-size: 18px; font-weight: 600;"></i>
                        <div class="dropdown-item center-text-vertically"
                                style="margin-left: 5px; font-size: 15px; font-weight: 550;"
                                unselectable="on"
                                onselectstart="return false;"
                                onmousedown="return false;">
                                <div id="tweet-info-who-can-reply-string">Everyone can reply</div>
                        </div>
                    </div>

                    <ul id="tweet-info-who-can-reply-choice-container" class="dropdown-menu" aria-labelledby="dropdownMenuButton1"
                        style="padding: 10px 0px; border: 1px solid black; border-radius: 22px;
                            -webkit-box-shadow:0 0 20px rgb(12, 114, 200); 
                            -moz-box-shadow: 0 0 20px rgb(12, 114, 200); 
                            box-shadow: 0 0 20px rgb(12, 114, 200);">
                        
                        <li role="presentation" class="dropdown-header" onclick="event.stopPropagation()"
                            style="display: block; font-size: 16px; font-weight: 600; padding-bottom: 15px; position: relative; padding-left: 15px;">
                            <div style="color: black;">Who can reply?</div>
                            <div style="font-size: 14px; font-weight: 450;">
                                Choose who can reply to this Tweet.<br> Anyone mentioned can always reply.
                            </div>
                        </li>
                        <li onclick="tweetInfoWhoCanReplyChoiceClikced(0, ${tweet_id})" style="position: relative; padding-left: 15px; padding-bottom: 10px; padding-top: 10px;">
                            <div style="display: flex; cursor: pointer;">
                                <div style="width: 40px; height: 40px; border-radius: 9999px; background-color: rgb(29, 155, 240); margin-right: 10px;">
                                    <i id="tweet-info-who-can-reply-icons-0" class="ri-earth-fill" style="display: block; color: white;
                                        transform: translate(25%, 25%); font-size: 20px;"></i>
                                </div>
                                <div class="dropdown-item center-text-vertically" style="font-size: 16px; font-weight: 550;">
                                    Everyone
                                </div>
                            </div>
                        </li>
                        <li onclick="tweetInfoWhoCanReplyChoiceClikced(1, ${tweet_id})" style="position: relative; padding-left: 15px; padding-bottom: 10px; padding-top: 10px;">
                            <div style="display: flex; cursor: pointer;">
                                <div style="width: 40px; height: 40px; border-radius: 9999px; background-color: rgb(29, 155, 240); margin-right: 10px;">
                                    <i id="tweet-info-who-can-reply-icons-1" class="fa fa-user" style="display: block; color: white;
                                        transform: translate(32%, 49%); font-size: 20px;"></i>
                                </div>
                                <div class="dropdown-item center-text-vertically" style="font-size: 16px; font-weight: 550;">
                                    People you follow
                                </div>
                            </div>
                        </li>
                        <li onclick="tweetInfoWhoCanReplyChoiceClikced(2, ${tweet_id})" style="position: relative; padding-left: 15px; padding-bottom: 10px; padding-top: 10px;">
                            <div style="display: flex; cursor: pointer;">
                                <div style="width: 40px; height: 40px; border-radius: 9999px; background-color: rgb(29, 155, 240); margin-right: 10px;">
                                    <i id="tweet-info-who-can-reply-icons-2" class="ri-at-line" style="display: block; color: white;
                                        transform: translate(25%, 25%); font-size: 20px;"></i>
                                </div>
                                <div class="dropdown-item center-text-vertically" style="font-size: 16px; font-weight: 550;">
                                    Only People you mention
                                </div>
                            </div>
                        </li>
                    </ul>
                    
                </div>
            </div>
        </div>
    `;
}



function showRelevantUsersForTweetInfo(users) {

    $('#third-body').prepend(`
        <div id="tweet-info-relevant-people-third-box" style="float: left; border: 1px solid gray; border-radius: 10px; margin-top: 20px; width: 65%; padding-bottom: 26px;">
            <div style="padding: 20px; padding-bottom: 0;">
                <p class="third-box-title">Relevant People</p>
            </div>
        </div>
    `)

    for (const user_id of users) {
        $.ajax({
            url: base_url + "user?id=" + user_id,
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(user) {
    
                $('#tweet-info-relevant-people-third-box').append(getRelevantUserCell(user, +getCurrentUserIdInLS()))
    
            }, error: function(request, status, error) {
                console.log('showRelevantUsersForTweetInfo: ' + user_id, request.responseText, status, error);
            }, complete: function() {
            }
        })
    }

}

function getRelevantUserCell(user, that_user_id) {

    function getFollowButton(user_id) {

        if (user_id == +getCurrentUserIdInLS())
            return ``;

        var isFollowing = false;

        $.ajax({
            url: base_url + "user/isfollow?user_id=" + getCurrentUserIdInLS() + "&followee_id=" + user_id,
            type: "GET",
            async: false,
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(res) {
                isFollowing = res;
            }, error: function(request, status, error) {
                console.log('getUserAsPeople-isFollowing: ', request.responseText, status, error);
            }, complete: function() {
            }
        })

        return `
            <div onclick="exploreFollowButtonClick(this, event, ` + user_id + `)" data-is-following="` + isFollowing + `"
                style="right: 1%; position: absolute; display: flex; margin-top: 5px; margin-right: 10px; cursor: pointer;">
                <div style="border-radius: 9999px; border: 1px solid black; padding: 5px 15px; font-weight: 650;">
                    ` + (isFollowing ? 'Following' : 'Follow') + `
                </div>
            </div>
        `;

    }

    return `
        <div style="padding-top: 15px;">
                            
            <div style="display: flex; cursor: pointer;">

                <div style="width: 100%;">

                    <div style="display: flex; position: relative;">
                        <div style="margin-left: 15px;">
                            <img onclick="takeToUserProfile(${user['id']})" style="width: 50px; height: 50px; border-radius: 50%; border: 1px solid black;"
                                src="images/icon_doge.jpeg" alt="User Icon">
                        </div>
                        <div style="margin-left: 10px;">
                            <div onclick="takeToUserProfile(${user['id']})" style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black;" href="#" role="link">
                                <span>${user['user_name']}</span>
                            </div>
                            <div onclick="takeToUserProfile(${user['id']})" style="cursor: pointer; font-size: 15px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                <span>@</span><span>${user['mention_name']}</span>
                            </div>
                        </div>
                        ${getFollowButton(user['id'])}
                    </div>

                    <div style="font-size: 14px; font-weight: 480; margin-left: 75px; color: rgb(81, 119, 215)">
                        ${getResultWithHashtags(user['status'])}
                    </div>

                </div>
            </div>

        </div>
    `;

}


function getRetweetDivForFirstTweet(tweetbox, is_main) {
    return `
        <div class="tweet-in-list" style="border: 1px solid black; border-radius: 10px; ${is_main ? 'margin-top: 10px; margin-bottom: -5px' : 'margin-top: 0px; margin-bottom: 10px'};">
            <div style="cursor: pointer; display: block;">
                
                <div style="display: flex; align-items: center; margin-bottom: 3px;">
                    <div onclick="takeToUserProfile(${tweetbox['user']['id']})"
                        style="margin-right: 7px;">
                        <img style="width: 30px; height: 30px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                    </div>
                    <div onclick="takeToUserProfile(${tweetbox['user']['id']})"
                        style="cursor: pointer; font-size: 15px; font: bolder; font-weight: 650; color: black; margin-right: 5px;">
                        <span>${tweetbox['user']['user_name']}</span>
                    </div>
                    <div onclick="takeToUserProfile(${tweetbox['user']['id']})"
                        style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);">
                        <span>@</span><span>${tweetbox['user']['mention_name']}<span>
                    </div>
                    <div style="margin: 0px 3px;">·</div>
                    <div class="remove-link-underline" style="cursor: pointer; font-size: 13px; font-weight: 500; color: rgb(110, 110, 110);">
                        ${getTimeSpanFromNow(tweetbox['tweet']['created_at'])}
                    </div>
                </div>
                <div style="width: 100%;">
                    
                    <p onclick="tweetInfoClicked(${tweetbox['tweet']['id']})"
                        style="font-size: 15px; font-weight: 500; cursor: pointer; margin-bottom: 0; word-break: break-word;">
                        ${tweetbox['tweet']['quote']}
                    </p>

                </div>
            </div>
        </div>
    `;
}


function getReplyDivForActualTweet(tweetbox) {
    return `
        <div>
            <div style="margin: 10px 10px; margin-bottom: 5px;">

                <div style="display: block; margin-bottom: 5px;">
                    <div style="display: block; margin-bottom: -2px;">

                        <div style="display: flex; margin-bottom: 3px;">
                            <div style="margin-right: 10px; background: white; padding-bottom: 3px;">
                                <div onclick="takeToUserProfile(${tweetbox['user']['id']}) style="cursor: pointer;">
                                    <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                                </div>
                            </div>
                            <div style="display: flex; margin-top: -20px; align-items: center; margin-bottom: 3px;">
                                <span onclick="takeToUserProfile(${tweetbox['user']['id']})" style="margin-right: 5px; cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black;">
                                    ${tweetbox['user']['mention_name']}
                                </span>
                                <span onclick="takeToUserProfile(${tweetbox['user']['id']})" style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);">
                                    @<span>${tweetbox['user']['user_name']}</span>
                                </span>
                                <span aria-hidden="true" style="margin: 0px 5px;">
                                    <span>·</span>
                                </span>
                                <span class="tweet-time-span">
                                    ${getTimeSpanFromNow(tweetbox['tweet']['created_at'])}
                                </span>
                            </div>
                        </div>


                        <div style="margin-left: 25px; margin-top: -20px; width: 100%; padding-right: 25px;">
                            
                            <div style="padding-left: 1px; min-height: 40px;
                                /* border-left: 1.7px solid rgb(160, 160, 160); */
                                ">
                                
                                <div style="padding-left: 32px; margin-top: -25px;">
                                    <div onclick="tweetInfoClicked(${tweetbox['tweet']['id']})" style="cursor: pointer; word-break: break-all; padding-bottom: 10px; font-size: 15px;">
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
            
            </div>
            <!-- REMOVE IF A REPLY -->
            <hr style="margin: 0; border: .9px solid black;">
            
        </div>
    `;
}