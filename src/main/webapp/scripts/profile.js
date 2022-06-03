function profileSubTitle(tweet_count) {
    return totalTweetsPara(tweet_count);
}

function onStatusEditClicked() {
    console.log('STATUS EDIT CLICKED');

    // CHANGE TEXT once after taken from user in both DB and here
    $('#second-user-profile-status-id')
}

function profileFollowerCountSuccessListener(result) {
    $('#second-user-profile-follower-count-id').text(result);
    $('#second-user-profile-follower-span-id').text("Follower" + (result == 1 ? '' : 's'));
}

var isFollowing = false;
var profileFollowerButtonObserver = null;

function followButtonClick(wt, user_id) {
    const element = wt == 0 ? $('#second-user-profile-follow-button-id') : $('#top-app-bar-follow-button');

    if (!isFollowing) {
        $.ajax({
            url: base_url + "user/follow?follower_id=" + getCurrentUserIdInLS() + "&followee_id=" + user_id,
            type: "POST",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: profileFollowerCountSuccessListener,
            error: function(request, status, error) {
                console.log('follow', request.responseText, status, error);
            }, complete: function() {
            }
        })
        isFollowing = true;
        element.text('Following');
    } else {
        $.ajax({
            url: base_url + "user/unfollow?follower_id=" + getCurrentUserIdInLS() + "&unfollowee_id=" + user_id,
            type: "DELETE",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: profileFollowerCountSuccessListener,
            error: function(request, status, error) {
                console.log('unfollow', request.responseText, status, error);
            }, complete: function() {
            }
        })
        isFollowing = false;
        element.text('Follow');
    }
}


function initFollowerOnClick(user_id) {
    $('.profile-following-div').click(function() {
        showFollowerTopLayer(+$(this).data('index'), user_id);
    })
}


$(function() {

    callDestructor();

    const user_id = getQueryValue(window.location.search, 'id');
    const isUserProfile = user_id == getCurrentUserIdInLS();

    profileFollowerButtonObserver?.disconnect();

    $.ajax({
        url: base_url + "user?id=" + user_id,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(user) {

            setTopAppBar({ title: user['user_name'], subTitle: profileSubTitle(user['total_tweets']), showBackButton: true });

            function getProfileFollowButton() {

                if (isUserProfile)
                    return ``;

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
                        console.log('isFollowing: ', request.responseText, status, error);
                    }, complete: function() {
                    }
                })

                $('#top-app-bar-follow-button').click(function() {
                    followButtonClick(1, user_id);
                })
                
                return `
                    <div onclick="followButtonClick(0, ` + user_id + `)" style="position: absolute; right: 30%; display: flex; margin-top: 10px; margin-right: 10px;">
                        <div id="second-user-profile-follow-button-id" style="cursor: pointer; border-radius: 9999px; border: 1px solid black; padding: 5px 15px; font-weight: 650;">` + (isFollowing ? 'Following' : 'Follow') + `</div>
                    </div>
                `;
            }

            $('#profile-container').append(
                `
                    <div class="user-profile">
                        <div>
                            <img id="second-user-profile-bg-img-id" style="cursor: pointer; width: 100%; height: 250px;" src="images/scenery.jpeg" alt="User Icon">
                        </div>
                        <div style="display: flex;">
                            <div href="#" style="margin-top: -80px; margin-left: 15px;">
                                <img id="second-user-profile-img-id" style="cursor: pointer; width: 150px; height: 150px; border-radius: 50%; border: 3px solid black;" src="images/default_profile.jpeg" alt="User Icon">
                            </div>
                            ` + getProfileFollowButton() + `
                        </div>
                        <div style="margin-top: 5px; margin-left: 20px; margin-bottom: 5px;">
                            <div href="#" id="second-user-profile-username-id" style="display: flex; cursor: pointer; font-weight: 700; font-size: 30px;">` + user['user_name'] + `</div>
                            <div href="#" style="display: flex; cursor: pointer; font-weight: 500; font-size: 15px; margin-top: -8px; color: rgb(110, 110, 110);">
                                <span>@</span><span id="second-user-profile-mention-id">` + user['mention_name'] + `</span>
                            </div>
                            <div style="display: ` + (isUserProfile || user['status'] != null ? 'flex' : 'none') + `;">
                                <div style="display: flex; font: Trebuchet MS, Helvetica, sans-serif; margin-top: 10px; font-weight: 500; color: rgb(81, 119, 215);">
                                    ` + '`<i id="second-user-profile-status-id">' + (isUserProfile && user['status'] == null ? "NO STATUS!!! CLICK TO ADD STATUS" : getResultWithHashtags(user['status'])) + '</i>`' + `
                                </div>
                                <div id="second-user-profile-status-edit-id" onclick="onStatusEditClicked()" style="display: ` + (isUserProfile ? `block` : `none`) + `; margin-top: 10px; margin-left: 20px; margin-right: 20px; cursor: pointer;">
                                    <i class="ri-pencil-fill"></i>
                                </div>
                            </div>
                            <div style="display: flex; margin-top: 20px;">
                                <i class="fa fa-calendar"></i>
                                <div style="cursor: pointer; font-weight: 500; font-size: 15px; margin-left: 5px; margin-top: -2px; color: rgb(110, 110, 110);">
                                    <span>Joined </span><span id="second-user-profile-joined-id">` + getDateForUserProfileFromTimestamp(user['created_at']) + `</span>
                                </div>
                            </div>
                            <div style="display: flex; margin-top: 10px;">
                                <div class="profile-following-div" data-index="0" style="cursor: pointer;">
                                    <span id="second-user-profile-followee-count-id" style="font-weight: 700;">` + user['total_followees'] + `</span>
                                    <span>Following</span>
                                </div>
                                <div class="profile-following-div" data-index="1" style="cursor: pointer; margin-left: 20px;">
                                    <span id="second-user-profile-follower-count-id" style="font-weight: 700;">` + user['total_followers'] + `</span>
                                    <span id="second-user-profile-follower-span-id">Follower` + (user['total_followers'] == 1 ? "" : "s") + `</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                +
                `
                    <div id="second-column-user-tweet-nav-bar-qqqq">
                        <div class="center-items tweet-nav-bar-qqqq" role="group">
                            <div id="tweet-nav-0" style="cursor: pointer;">
                                <span id="second-column-user-tweet-nav-title-0" class="tweet-nav-bar-qqqq-title-inactive">All</span>
                                <div id="second-column-user-tweet-nav-bottom-bar-0" class="tweet-nav-bar-qqqq-bottom-bar-inactive"></div>
                            </div>
                            <div id="tweet-nav-1" style="cursor: pointer;">
                                <span id="second-column-user-tweet-nav-title-1" class="tweet-nav-bar-qqqq-title-inactive">Retweets</span>
                                <div id="second-column-user-tweet-nav-bottom-bar-1" class="tweet-nav-bar-qqqq-bottom-bar-inactive"></div>
                            </div>
                            <div id="tweet-nav-2" style="cursor: pointer;">
                                <span id="second-column-user-tweet-nav-title-2" class="tweet-nav-bar-qqqq-title-inactive">Replies</span>
                                <div id="second-column-user-tweet-nav-bottom-bar-2" class="tweet-nav-bar-qqqq-bottom-bar-inactive"></div>
                            </div>
                            <div id="tweet-nav-3" style="cursor: pointer;">
                                <span id="second-column-user-tweet-nav-title-3" class="tweet-nav-bar-qqqq-title-inactive">Likes</span>
                                <div id="second-column-user-tweet-nav-bottom-bar-3" class="tweet-nav-bar-qqqq-bottom-bar-inactive"></div>
                            </div>
                        </div>
                        <hr style="margin-top: -1px;">
                    </div>

                    <div id="profile-tweet-container-qqqq">

                        <div id="profile-tweet-container-qqqq-0">
                            
                        </div>
                        <div id="profile-tweet-container-qqqq-1">
                        
                        </div>
                        <div id="profile-tweet-container-qqqq-2">
                            
                        </div>
                        <div id="profile-tweet-container-qqqq-3">
                            
                        </div>
                        
                    </div>
                `
                )

            // MOVE BELOW
            if (!isUserProfile) {
                let toggle = true
                profileFollowerButtonObserver = respondToVisibility(document.getElementById('second-user-profile-follow-button-id'), visible => {
                    
                    toggle ^= true;
                    console.log('##### follow button', visible, toggle, $('#top-app-bar-search-box').css('display') == 'block');

                    if (toggle) {

                        if ($('#top-app-bar-search-box').css('display') == 'block')
                            prevTopBarVals = { title: user['user_name'], subTitle: profileSubTitle(user['total_tweets']), showBackButton: true, followText: isFollowing ? 'Following' : 'Follow' };
                            // setTopAppBar({ showBackButton: true, showSearchBox: true, followText: null });
                        else
                            setTopAppBar({ title: user['user_name'], subTitle: profileSubTitle(user['total_tweets']), showBackButton: true, followText: isFollowing ? 'Following' : 'Follow' });

                        // setTopAppBar({ title: user['user_name'], subTitle: profileSubTitle(user['total_tweets']), showBackButton: true });                        
                        // showUI($('#top-app-bar-follow-button'))
                        // $('#top-app-bar-follow-button').text(isFollowing ? 'Following' : 'Follow');
                    } else {
                        if ($('#top-app-bar-search-box').css('display') == 'block')
                            prevTopBarVals = { title: user['user_name'], subTitle: profileSubTitle(user['total_tweets']), showBackButton: true, followText: null };
                            // setTopAppBar({ showBackButton: true, showSearchBox: true, followText: null });
                        else
                            setTopAppBar({ title: user['user_name'], subTitle: profileSubTitle(user['total_tweets']), showBackButton: true, followText: null });

                        $('#second-user-profile-follow-button-id').text(isFollowing ? 'Following' : 'Follow');
                        
                        // showUI($('#top-app-bar-follow-button'), false)
                        // $('#second-user-profile-follow-button-id').text(isFollowing ? 'Following' : 'Follow');
                    }
                }, { root: null, rootMargin: '0px', threshold: 0 })
            }


            initFollowerOnClick(user_id);


            var prevId = 0;

            function navClick(e) {

                $('#profileFeedsSpinnerId').show();

                var currId = this.id[this.id.length - 1];

                document.getElementById("second-column-user-tweet-nav-title-" + prevId).style.fontSize = "14px";
                document.getElementById("second-column-user-tweet-nav-title-" + prevId).style.fontWeight = "500";
                document.getElementById("second-column-user-tweet-nav-title-" + prevId).style.color = "rgb(110, 110, 110)";   
                $("#second-column-user-tweet-nav-bottom-bar-" + prevId).hide();
                $("#profile-tweet-container-qqqq-" + prevId).hide();

                document.getElementById("second-column-user-tweet-nav-title-" + currId).style.fontSize = "16px";
                document.getElementById("second-column-user-tweet-nav-title-" + currId).style.fontWeight = "600";
                document.getElementById("second-column-user-tweet-nav-title-" + currId).style.color = "black";
                $("#second-column-user-tweet-nav-bottom-bar-" + currId).show();
                $("#profile-tweet-container-qqqq-" + currId).show();

                prevId = currId;

                return false;

            }

            for (let i = 3; ~i; i--)
                $("#tweet-nav-" + i).click(navClick);
            
            $("#tweet-nav-0").click();

            const controller = [
                getProfileTweetController(0, user),
                getProfileTweetController(1, user),
                getProfileTweetController(2, user),
                getProfileTweetController(3, user)
            ];

            const observer = respondToVisibility(document.getElementById('profileFeedsSpinnerId'), visibile => {
                if (!visibile)
                    return;

                loadMore(controller[prevId]);
                
            })

        }, error: function(request, status, error) {
            console.log('showUserProfile', request.responseText, status, error);
        }, complete: function() {
        }
    })
    
})

function addTweetsInUserProfileContainer(user) {

    $.ajax({
		url: base_url + "tweet/" + user['id'],
		type: "GET",
		contentType: "application/json; charSet=UTF-8",
		dataType: "json",
		timeout: 2500,
		success: function(tweets) {

            for (const tweet of tweets) {

                $("#profile-tweet-container-qqqq").prepend(getSingleTweetForSecondColumnTweetsContainer(tweet, user));

            }

        }, error: function(request, status, error) {
			console.log('addTweetsInUserProfileContainer', request.responseText, status, error);
		}, complete: function() {
		}
	})

}

function getProfileTweetController(index, user) {
    return {
        user: user,
        index: index,
        pageNo: 0,
        pageSize: 10,
        minTS: getTimestampFormattedValue(new Date()),
        endReached: false
    }
}

function loadMore(controller) {

    if (controller.endReached) {
        $('#profileFeedsSpinnerId').hide();
        return;
    }

    function endReached() {

        console.log("END DA " + controller.index);

        $('#profileFeedsSpinnerId').hide();

        $('#profile-tweet-container-qqqq-' + controller.index).append(
            controller.pageNo ? getContentEndPlaceholder(endReachedTitles) : 
                getContentEmptyPlaceholder(nothingToShowInProfileTweetsTitles(
                    controller.index == 0 ? "No Activity to be found from " + controller.user['user_name'] + "." :
                    controller.index == 1 ? "No Retweets made!!!" :
                    controller.index == 2 ? "No Replies made!!!" :
                                            "No Likes made!!!")));

        controller.endReached = true;

    }

    $.ajax({
        url: base_url + "tweet/tprofile?user_id=" + controller.user['id'] +"&minTs=" + controller.minTS + "&size=" + (controller.pageSize+1) + "&start=" + controller.pageNo + "&index=" + controller.index,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(tweetPieces) {

            if (tweetPieces == null || tweetPieces.length == 0) {
                console.log("END REACHED DA!!! NO MORE TWEETS FOR PROFILE AT " + controller.index + "!!!!");
                endReached();
                return;
            }

            for (const tweetPiece of tweetPieces.slice(0, tweetPieces.length > controller.pageSize ? -1 : undefined)) {

                if (tweetPiece['type'] == "QUOTED")
                    $('#profile-tweet-container-qqqq-' + controller.index).append(getQuotedRetweet(tweetPiece['parent'], tweetPiece['child']));
                else if (tweetPiece['type'] == "RETWEET")
                    $('#profile-tweet-container-qqqq-' + controller.index).append(getRetweet(controller.user['id'], tweetPiece['parent'], tweetPiece['child']));
                else if (tweetPiece['type'] == "REPLY")
                    $('#profile-tweet-container-qqqq-' + controller.index).append(getReply(tweetPiece['parent'], tweetPiece['child']));
                else
                    $('#profile-tweet-container-qqqq-' + controller.index).append(getSingleTweetForSecondColumnTweetsContainer(tweetPiece['child']['tweet'], tweetPiece['child']['user']));
                
            }

            controller.pageNo += controller.pageSize;

            if (tweetPieces.length <= controller.pageSize)
                endReached();

        }, error: function(request, status, error) {
            console.log('profile' + controller.index, request.responseText, status, error);
        }, complete: function() {
        }
    })
}
