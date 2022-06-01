function getReplyIconDiv(tweet_id, user_id, replyCount) {
    return `
        <div onclick="replyClicked(` + user_id + `, ` + tweet_id + `)" style="cursor: pointer; display: flex;">
            <i class="fa fa-reply" style="font-size: 20px;" aria-hidden="true"></i>
            <span id="count" style="margin-left: 10px; font-size: 14px; font-weight: 500;">` + replyCount +`</span>
        </div>
    `;
}

function getRetweetIconDiv(tweet_id, retweetCount, isRetweeted) {
    return `
        <div class="dropdown">
            <div id="retweet-dropdown-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                ` + (isRetweeted ? ` class="retweet-qqqq-color" ` : ``) + `
                style="cursor: pointer; display: flex;">
                <i class="fa fa-retweet" style="font-size: 20px;"></i>
                <span id="count" style="margin-left: 10px; font-size: 14px; font-weight: 500;">` + retweetCount + `</span>
            </div>
            <div class="dropdown-menu" aria-labelledby="retweet-dropdown-menu" style="background-color: white; border: 1px solid black; border-radius: 15px;
                -webkit-box-shadow:0 0 20px rgb(12, 114, 200); 
                -moz-box-shadow: 0 0 20px rgb(12, 114, 200); 
                box-shadow: 0 0 20px rgb(12, 114, 200);">

                <div data-retweet-type="retweet" style="cursor: pointer; display: flex; margin: 11px 13px; margin-bottom: 15px;"
                    data-is-retweeted=` + isRetweeted + `
                    onclick="retweetMenuItemsClick(this, ` + tweet_id + `, event)">
                    <div style="margin-right: 10px;">
                        <i style="font-size: 22px;" class="fa fa-retweet"></i>
                    </div>
                    <div style="display: flex;">
                        <div class="center-text-vertically" style="text-align: center; font-size: 15px;">` + (isRetweeted ? "Undo " : "") + `Retweet</div>
                    </div>
                </div>

                <div data-retweet-type="quote" style="cursor: pointer; display: flex; margin: 11px 13px; margin-top: 25px;"
                    onclick="retweetMenuItemsClick(this, ` + tweet_id + `, event)">
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

function getLikeIconDiv(tweet_id, likeCount, isLiked) {
    return `
        <div data-isclicked="` + isLiked +`" onclick="likeClicked(this, ` + tweet_id + `)" style="cursor: pointer; display: flex; ` + (isLiked ? "color: #fa2c8b" : "") + `;">
            <i class="fa fa-heart" style="font-size: 20px;"></i>
            <span id="count" style="margin-left: 10px; font-size: 14px; font-weight: 500;">` + likeCount +`</span>
        </div>
    `;
}

function getShareIconDiv(tweet_id) {
    return `
        <div onclick="shareClicked(` + tweet_id + `)" style="font-size: 20px; cursor: pointer; display: flex;">
            <i class="fa fa-share"></i>
        </div>
    `;
}