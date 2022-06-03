


function getqqqq(tweet, user) {

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

            ans =
                `<div class="tweet-tool-icons" role="group">` +
                    getReplyIconDiv(tweet['id'], user['id'], tweet['total_replies']) +
                    getRetweetIconDiv(tweet['id'], tweet['total_retweets'], isRetweeted) +
                    getLikeIconDiv(tweet['id'], tweet['total_likes'], isLiked) +
                    getShareIconDiv(tweet['id']) + `
                </div>`

        }, error: function(request, status, error) {
            console.log('getIQQTof: ' + tweet['id'] + "," + user['id'], request.responseText, status, error);
        }, complete: function() {
        }
    })

    // while (ans == null);

    return ans;
}

function takeToUserProfile(user_id) {

    showUserProfile(true, user_id);
    
}

function exploreFollowButtonClick(element, event, user_id) {

    event.stopPropagation();

    element = $(element);

    console.log('exploreFollowButtonClick', element.data('is-following'), element.children().text(), user_id);

    if (!element.data('is-following')) {
        $.ajax({
            url: base_url + "user/follow?follower_id=" + getCurrentUserIdInLS() + "&followee_id=" + user_id,
            type: "POST",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(res) {
                console.log('exploreFollowButtonClick', true, res);
            },
            error: function(request, status, error) {
                console.log('exploreFollowButtonClick-true', request.responseText, status, error);
            }, complete: function() {
            }
        })
        element.data('is-following', true);
        element.children().first().text('Following');
    } else {
        $.ajax({
            url: base_url + "user/unfollow?follower_id=" + getCurrentUserIdInLS() + "&unfollowee_id=" + user_id,
            type: "DELETE",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(res) {
                console.log('exploreFollowButtonClick', false, res);
            },
            error: function(request, status, error) {
                console.log('exploreFollowButtonClick-false', request.responseText, status, error);
            }, complete: function() {
            }
        })
        element.data('is-following', false);
        element.children().first().text('Follow');
    }
}

function getUserAsPeople(user) {

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
            <div onclick="exploreFollowButtonClick(this, event, ` + user_id + `)" data-is-following="` + isFollowing + `" style="position: absolute; right: 30%; display: flex; margin-top: 0px; margin-right: 10px;">
                <div style="border-radius: 9999px; border: 1px solid black; padding: 7px 15px; font-weight: 650; cursor: pointer;">
                    ` + (isFollowing ? 'Following' : 'Follow') + `
                </div>
            </div>
        `;
    }

    return `
        <div onclick="takeToUserProfile(` + user['id'] + `)" style="margin: 10px; cursor: pointer;
            margin-bottom: ` + (user['status'] == null ? '30' : '20') + `px;">
            <div style="display: flex;">
                <div style="margin-left: 5px;">
                    <img style="width: 50px; height: 50px; border-radius: 50%; border: 1px solid black;"
                        src="images/icon_doge.jpeg" alt="User Icon">
                </div>
                <div style="display: block; margin-left: 10px; cursor: pointer;">
                    <div style="font-size: 16px; font-weight: 600;">` + user['user_name'] + `</div>
                    <div style="color: rgb(110, 110, 110); font-weight: 500;">@` + user['mention_name'] + `</div>
                    <div style="margin-top: 5px; font: Trebuchet MS, Helvetica, sans-serif; font-size: 16px; font-weight: 500; color: rgb(81, 119, 215);">` +
                        getResultWithHashtags(user['status'])
                    + `</div>
                </div>
                ` + getFollowButton(user['id']) + `
            </div>
        </div>
        <hr style="margin: 0 0;">
    `;

}


function getSingleTweetForSecondColumnTweetsContainer(tweet, user) {
    return `
        <div>
            <div class="tweet-in-list">
                <div style="display: flex;">
                    <div style="cursor: pointer; margin-right: 10px;">
                        <img id="single-tweet-profile-id-" onclick="userInfoClicked(` + user['id'] + `)" style="width: 50px; height: 50px; border-radius: 50%;" src="images/default_profile.jpeg" alt="User Icon">
                    </div>
                    <div style="width: 100%;">
                        <div style="display: flex; align-items: center; margin-bottom: 3px;">
                            <div onclick="takeToUserProfile(` + user['id'] + `)" style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" role="link">
                                <span>` + user['user_name'] + `</span>
                            </div>
                            <div onclick="takeToUserProfile(` + user['id'] + `)" style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                <span>@</span><span>` + user['mention_name'] + `<span>
                            </div>
                            
                            <span aria-hidden="true" style="margin: 0px 5px;">
                                <span>·</span>
                            </span>
                            <a class="remove-link-underline tweet-time-span" style="cursor: pointer;" rel="noopener noreferrer" target="_blank" role="link">
                                <span id="single-tweet-time-id-">` + getTimeSpanFromNow(tweet['created_at']) + `</span>
                            </a>
                        </div>

                        <p id="single-tweet-tweet-id-" onclick="tweetInfoClicked('` + tweet + `')" style="cursor: pointer;">` + getResultWithHashtags(tweet['quote']) + `</p>

                        ` + getqqqq(tweet, user) + `
                        
                    </div>
                </div>
            </div>
            <hr style="margin-top: 4px; margin-bottom: 0;">
        </div>
    `;
}

function getQuotedRetweet(parent, child) {
    return `
        <div>
            <div class="tweet-in-list">
                <div style="display: flex;">
                    <div style="cursor: pointer; margin-right: 10px;">
                        <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                    </div>
                    <div style="width: 100%;">
                        <div style="display: flex; align-items: center; margin-bottom: 3px;">
                            <div onclick="takeToUserProfile(` + child['user']['id'] + `)" style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
                                <span>` + child['user']['user_name'] + `</span>
                            </div>
                            <div onclick="takeToUserProfile(` + child['user']['id'] + `)" style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                <span>@</span><span>` + child['user']['mention_name'] + `<span>
                            </div>
                            <span aria-hidden="true" style="margin: 0px 5px;">
                                <span>·</span>
                            </span>
                            <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
                                <span>` + getTimeSpanFromNow(child['tweet']['created_at']) + `</span>
                            </a>
                        </div>

                        <p onclick="tweetInfoClicked('` + tweetInfoClicked(child['tweet']) + `')" style="cursor: pointer;">` + getResultWithHashtags(child['tweet']['quote']) + `</p>

                        <div class="tweet-in-list" style="border: 1px solid black; border-radius: 10px;">
                            <div style="cursor: pointer; display: flex;">
                                <div style="margin-right: 10px;">
                                    <img style="width: 30px; height: 30px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                                </div>
                                <div style="width: 100%;">
                                    <div style="display: flex; align-items: center; margin-bottom: 3px;">
                                        <div onclick="takeToUserProfile(` + parent['user']['id'] + `)" style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
                                            <span>` + parent['user']['user_name'] + `</span>
                                        </div>
                                        <div onclick="takeToUserProfile(` + parent['user']['id'] + `)" style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                            <span>@</span><span>` + parent['user']['mention_name'] + `<span>
                                        </div>
                                        <span aria-hidden="true" style="margin: 0px 5px;">
                                            <span>·</span>
                                        </span>
                                        <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
                                            <span>` + getTimeSpanFromNow(parent['tweet']['created_at']) + `</span>
                                        </a>
                                    </div>

                                    <p onclick="tweetInfoClicked('` + tweetInfoClicked(parent['tweet']) + `')" style="cursor: pointer; margin-bottom: 0;">` + getResultWithHashtags(parent['tweet']['quote']) + `</p>

                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 10px;">

                            ` + getqqqq(child['tweet'], child['user']) + `

                        </div>

                    </div>
                </div>
            </div>
            <hr style="margin-top: 4px; margin-bottom: 0;">
        </div>
    `;
}

function getRetweet(user_id, parent, child) {
    return `
        <div>
            <div class="tweet-in-list">
                <div style="display: flex; cursor: pointer;">
                    <div>
                        <i class="fa fa-retweet" style="font-size: 16px; margin-left: 30px;;"></i>
                    </div>
                    <div style="margin-left: 10px;" class="center-text-vertically">
                        <div style="color: rgb(110, 110, 110); font-size: 13px; font-weight: 600;">
                            <span>` + (child['user']['id'] == user_id ? "You" : "@" + child['user']['mention_name']) + `</span><span> Retweeted</span>
                        </div>
                    </div>
                </div>
                <div style="display: flex;">
                    <div style="cursor: pointer; margin-right: 10px;">
                        <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                    </div>
                    <div style="width: 100%;">
                        <div style="display: flex; align-items: center; margin-bottom: 3px;">
                            <div onclick="takeToUserProfile(` + parent['user']['id'] + `)" style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
                                <span>` + parent['user']['user_name'] + `</span>
                            </div>
                            <div onclick="takeToUserProfile(` + parent['user']['id'] + `)" style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                <span>@</span><span>` + parent['user']['mention_name'] + `<span>
                            </div>
                            
                            <span aria-hidden="true" style="margin: 0px 5px;">
                                <span>·</span>
                            </span>
                            <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
                                <span id="tweet-source-label">` + getTimeSpanFromNow(parent['tweet']['created_at']) + `</span>
                            </a>
                        </div>

                        <p onclick="tweetInfoClicked('` + tweetInfoClicked(parent['tweet']) + `')" style="cursor: pointer; margin-bottom: 0;">` + getResultWithHashtags(parent['tweet']['quote']) + `</p>

                        <div style="margin-top: 10px;">

                            ` + getqqqq(parent['tweet'], parent['user']) + `

                        </div>

                    </div>
                </div>
            </div>
            <hr style="margin-top: 4px; margin-bottom: 0;">
        </div>
    `;
}

function getReply(parent, child) {
    return `
        <div>
            <div class="tweet-in-list">
                <div style="display: flex; margin-bottom: 25px;">
                    <div style="margin-right: 10px;">
                        <div style="cursor: pointer;">
                            <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                        </div>
                        <div>
                            <div style="height: 25px; border: 0.5px solid gray; width: 0; margin-left: 50%; margin-top: 2px;"></div>
                        </div>
                    </div>
                    <div style="width: 100%;">
                        <div style="display: flex; align-items: center; margin-bottom: 3px;">
                            <div onclick="takeToUserProfile(` + parent['user']['id'] + `)" style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
                                <span>` + parent['user']['user_name'] + `</span>
                            </div>
                            <div onclick="takeToUserProfile(` + parent['user']['id'] + `)" style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                <span>@</span><span>` + parent['user']['mention_name'] + `<span>
                            </div>
                            <span aria-hidden="true" style="margin: 0px 5px;">
                                <span>·</span>
                            </span>
                            <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
                                <span>` + getTimeSpanFromNow(parent['tweet']['created_at']) + `</span>
                            </a>
                        </div>

                        <p onclick="tweetInfoClicked('` + tweetInfoClicked(parent['tweet']) + `')" style="cursor: pointer;">` + getResultWithHashtags(parent['tweet']['quote']) + `</p>

                        ` + getqqqq(parent['tweet'], parent['user']) + `

                    </div>
                </div>
                <div style="border-radius: 10px;">
                    <div style="display: flex;">
                        <div style="cursor: pointer; margin-right: 10px;">
                            <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                        </div>
                        <div style="width: 100%;">
                            <div style="display: flex; align-items: center; margin-bottom: 3px;">
                                <div onclick="takeToUserProfile(` + child['user']['id'] + `)" style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
                                    <span>` + child['user']['user_name'] + `</span>
                                </div>
                                <div onclick="takeToUserProfile(` + child['user']['id'] + `)" style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                    <span>@</span><span>` + child['user']['mention_name'] + `<span>
                                </div>
                                <span aria-hidden="true" style="margin: 0px 5px;">
                                    <span>·</span>
                                </span>
                                <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
                                    <span>` + getTimeSpanFromNow(child['tweet']['created_at']) + `</span>
                                </a>
                            </div>

                            <p onclick="tweetInfoClicked('` + tweetInfoClicked(child['tweet']) + `')" style="cursor: pointer;">` + getResultWithHashtags(child['tweet']['quote']) + `</p>

                            ` + getqqqq(child['tweet'], child['user']) + `

                        </div>
                    </div>
                </div>
            </div>
            <hr style="margin-top: 4px; margin-bottom: 0;">
        </div>
    `;
}
