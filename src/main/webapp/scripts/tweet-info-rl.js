
function initListeners() {

    $('#tweet-info-rl-back-button').on('click', function() {

        $('#auxiliary-container').empty();

        window.history.replaceState(null, "showRLTweetInfoTopLayer", getSearchQueryFromMap(removeQueryParam('rl')));

    })

    $('#tweet-info-rl-div').on('click', function() {

        $('#auxiliary-container').empty();

        window.history.replaceState(null, "showRLTweetInfoTopLayer", getSearchQueryFromMap(removeQueryParam('rl')));

    })

}




$(function() {

    var controller = {
        pageNo: 0,
        pageSize: 5
    };


    initListeners();



    const uri = decodeURIComponent(window.location.search);
    const qp = getQueryKVMap(uri);

    controller.tweet_id = qp.get('id');
    controller.rl = qp.get('rl');



    if (controller.rl == 'retweet') {
        
        $('#tweet-info-rl-title').text('Retweeted by');
        controller.after_user_id = -1;

    } else if (controller.rl == 'like') {
        
        $('#tweet-info-rl-title').text('Liked by');

    }

    const tweetInfoRLObserver = respondToVisibility(document.getElementById('tweet-info-rl-spinner'), visibile => {

        if (!visibile)
            return;

        loadMoreForRLTweetInfo(controller);
        
    })

})


function loadMoreForRLTweetInfo(controller) {

    showUI($('#tweet-info-rl-spinner'), false);

    if (controller.rl == 'retweet')
        $.ajax({
            url: base_url + `tweet/retweet/users?tweet_id=${controller.tweet_id}&after_user_id=${controller.after_user_id}&page=${controller.pageNo}&size=${controller.pageSize+1}`,
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(users) {

                for (const user of users.slice(0, users.length > controller.pageSize ? -1 : undefined)) {
                
                    controller.after_user_id = user['id'];
                    $('#tweet-info-rl-container').append(getUserProfileTweetInfoCell(user, controller.tweet_id));
                
                }

                controller.pageNo += controller.pageSize;

                if (users.length <= controller.pageSize)
                    $('#tweet-info-rl-container').append(`<div style="height: 500px;"></div>`);
                else
                    showUI($('#tweet-info-rl-spinner'));


            }, error: function(request, status, error) {
                console.log('loadMoreForRLTweetInfo-retweets', request.responseText, status, error);
            }, complete: function() {
            }
        })
    else if (controller.rl == 'like')
        $.ajax({
            url: base_url + `tweet/like/users?tweet_id=${controller.tweet_id}&page=${controller.pageNo}&size=${controller.pageSize+1}`,
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(users) {

                for (const user of users.slice(0, users.length > controller.pageSize ? -1 : undefined))
                
                    $('#tweet-info-rl-container').append(getUserProfileTweetInfoCell(user, controller.tweet_id));


                controller.pageNo += controller.pageSize;

                if (users.length <= controller.pageSize)
                    $('#tweet-info-rl-container').append(`<div style="height: 500px;"></div>`);
                else
                    showUI($('#tweet-info-rl-spinner'));

            }, error: function(request, status, error) {
                console.log('loadMoreForRLTweetInfo-retweets', request.responseText, status, error);
            }, complete: function() {
            }
        })
    
}



function userProfileTweetInfoCellClicked(user_id) {

    $('#auxiliary-container').empty();
    takeToUserProfile(user_id);

}


function getUserProfileTweetInfoCell(user, tweet_id) {

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
            <div onclick="exploreFollowButtonClick(this, event, ${user_id})" data-is-following="${isFollowing}"
                style="right: 1%; position: absolute; display: flex; margin-top: 5px; margin-right: 10px; cursor: pointer;">
                <div style="border-radius: 9999px; border: 1px solid black; padding: 5px 15px; font-weight: 650;">
                    ${(isFollowing ? 'Following' : 'Follow')}
                </div>
            </div>
        `;
    }

    return `
        <div style="padding-top: 10px;">
                            
        <div onclick="userProfileTweetInfoCellClicked(${user['id']})" style="display: flex; cursor: pointer;">

                <div style="width: 100%;">

                    <div style="display: flex; position: relative;">
                        <div style="margin-left: 15px;">
                            <img style="width: 50px; height: 50px; border-radius: 50%; border: 1px solid black;"
                                src="images/icon_doge.jpeg" alt="User Icon">
                        </div>
                        <div style="margin-left: 10px;">
                            <div style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black;" href="#" role="link">
                                <span id="tweet-time">${user['user_name']}</span>
                            </div>
                            <div style="cursor: pointer; font-size: 15px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                <span>@</span><span id="tweet-time">${user['mention_name']}</span>
                            </div>
                        </div>
                        ${getFollowButton(user['id'])}
                    </div>

                    <div style="font-size: 14px; font-weight: 480; margin-left: 75px; color: rgb(81, 119, 215)">
                        ${getResultWithHashtags(user['status'])}
                    </div>

                </div>
            </div>
            <hr style="margin-bottom: 0px; margin-top: 10px;">

        </div>
    `;

}