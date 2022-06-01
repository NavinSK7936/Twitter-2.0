


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
