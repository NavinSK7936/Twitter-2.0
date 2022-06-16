function getReplyIconDiv(tweet_id, user_id, replyCount) {

    var ans = `
        <div onclick="replyClicked(${user_id}, ${tweet_id})" style="cursor: pointer; display: flex;">
            <i class="fa fa-reply" style="font-size: 20px;" aria-hidden="true"></i>
            <span style="margin-left: 10px; font-size: 14px; font-weight: 500;">${replyCount}</span>
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
            
                        <i class="fa fa-reply" style="font-size: 16px; opacity: .4;" aria-hidden="true"></i>
                        <span style="margin-left: 10px; font-size: 13px; font-weight: 500; opacity: .4;">${replyCount}</span>
            
                    </div>
                `
            
        }, error: function(request, status, error) {
            console.log('getReplyIconDiv-can_reply', request.responseText, status, error);
        }, complete: function() {
        }
    })

    return ans;
}

function getRetweetIconDiv(tweet_id, retweetCount, isRetweeted) {
    return `
        <div class="dropdown" data-type="retweetIconDivQQQQ">
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