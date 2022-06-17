function setWhoToFollowThirdDiv() {
    $.ajax({
        url: base_url + "user/recommended/users?user_id=" + getCurrentUserIdInLS() + "&size=3",
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(users) {

            if (users.length == 0) {

                $('#third-box-who-to-follow-container').remove();
                return;
            }

            showUI($('#third-box-who-to-follow-spinner'), false);

            users.forEach(
                user => $('#third-box-who-to-follow-container').append(getRelevantUserCell(user))
            );  

        }, error: function(request, status, error) {
            console.log('setWhoToFollowThirdDiv', request.responseText, status, error);
        }, complete: function() {
        }
    })
}

function setTrendingHashtags() {
    $.ajax({
        url: base_url + "tweet/hashtags/trending?limit=5",
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(hashtags) {

            if (Object.keys(hashtags).length == 0) {
                
                $('#third-box-trending-container').remove();
                return;
            }

            showUI($('#third-box-trending-spinner'), false);

            for (const hashtag in hashtags)
                $('#third-box-trending-container').append(`
                    <div style="display: flex; margin: 0 20px;">
                        <div>
                            <a style="font-size: 30px;">·</a>
                        </div>
                        <div onclick="onHashtagClicked(event, '#${hashtag}')" style="padding-left: 13px; margin-top: 4px; cursor: pointer;">
                            <p style="font-size: 20px; font-weight: 600;">#${hashtag}</p>
                            <p style="margin-top: -13px; font-size: 13px; color: gray; font-style: italic;">${hashtags[hashtag]} Tweet${hashtags[hashtag] != 1 ? 's' : ''}</p>
                        </div>
                    </div>
                `)

        }, error: function(request, status, error) {
            console.log('setTrendingHashtags', request.responseText, status, error);
        }, complete: function() {
        }
    })
}

$(function() {

    setWhoToFollowThirdDiv();
    setTrendingHashtags();

})