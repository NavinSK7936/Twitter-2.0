function onHashtagClicked(event, hashtag) {
    event.stopPropagation();
    console.log(hashtag);

    showExploreSection('p=explore&q=' + hashtag);
}

function onMentionClicked(event, user_id) {
    event.stopPropagation();
    takeToUserProfile(user_id);
}


const mentionPattern = /^.*\${{([0-9]+)}}.*$/

function getIdFromMentionPattern(str) {
    var match = mentionPattern.exec(str)
    return match != null ? +match[1] : -1;
}

function getResultWithHashtags(quote) {

    var ans = ``;

    if (quote == null)
        return ans;

    function getHashtagSpan(word) {
        function onHashtagClicked(event, hashtag) {
            onHashtagClicked(event, hashtag);
        }
        return `<span style="color: ` + hashtagColor + `; cursor: pointer;" onclick="onHashtagClicked(event, '` + word + `')">` + word + `</span>`;
    }

    function getMentionSpan(user_id, mention) {
        function onMentionClicked(event, user_id) {
            onMentionClicked(event, user_id);
        }
        return `<span style="color: ` + hashtagColor + `; cursor: pointer;" onclick="onMentionClicked(event, '` + user_id + `')">` + mention + `</span>`;
    }

    for (const word of quote.split(' ')) {
        if (mentionPattern.test(word)) {
            const mentionId = getIdFromMentionPattern(word);
            $.ajax({
                url: base_url + "user/mention?id=" + mentionId,
                type: "GET",
                async: false,
                contentType: "application/json; charSet=UTF-8",
                dataType: "json",
                timeout: 2500,
                success: function(mentionName) {
                    ans += getMentionSpan(mentionId, '@' + mentionName);
                    // console.log('lopipopo', mentionName, ans);
                }, error: function(request, status, error) {
                    ans += getMentionSpan(mentionId, '@' + request.responseText);
                    // console.log('error:: mentionId: ' + mentionId, request.responseText, status, error);
                }, complete: function() {
                }
            })
        } else if (word[0] == '#')
            ans += getHashtagSpan(word);
        else
            ans += word;

        ans += ` `;

    }

    return ans.trim();

}

// Is meant to display the user page, when clicked from a Tweet or something else
// The user obj is passed here
function userInfoClicked(user_id) {
    console.log(user_id);



}

// Is meant to display the Tweet page, when clicked from a Tweet or something else
// The tweet obj is passed here
function tweetInfoClicked(id) {
    
    

}

function replyClicked(user_id, tweet_id) {
    
    let tweetBox = {};

    $.ajax({
        url: base_url + "user/id/" + user_id,
        type: "GET",
        async: false,
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(user) {
            tweetBox['user'] = user;
        }, error: function(request, status, error) {
            console.log('error:: replyClicked-user: ' + mentionId, request.responseText, status, error);
        }, complete: function() {
        }
    })

    $.ajax({
        url: base_url + "tweet/id/" + tweet_id,
        type: "GET",
        async: false,
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(tweet) {
            tweetBox['tweet'] = tweet;
        }, error: function(request, status, error) {
            console.log('error:: replyClicked-tweet: ' + mentionId, request.responseText, status, error);
        }, complete: function() {
        }
    })

    console.log(tweetBox);

    showTopLayerTweet(tweetBox);

}

function retweetClicked(event, tweet_id) {

    event.stopPropagation();

    console.log(event.clientX, event.clientY, tweet_id);


}

function showUI(element, toShow = true) {

    if (toShow) {
        element.css('display', 'block');
        element.css('display', '');
    } else
        element.css('display', 'none');

}