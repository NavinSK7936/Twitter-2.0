
function getUserProfileFollowerCell(user) {

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
            <div onclick="exploreFollowButtonClick(this, event, ` + user_id + `)" data-is-following="` + isFollowing + `" style="margin-top: 0px; margin-right: 10px; flex-flow: column wrap; flex-grow: 1; margin-left: 60%;">
                <div style="border-radius: 9999px; border: 1px solid black; padding: 6px 20px; font-weight: 650; cursor: pointer;" class="center-items">
                    ` + (isFollowing ? 'Following' : 'Follow') + `
                </div>
            </div>
        `;

    }

    return `
        <div>
            <div onclick="takeToUserProfile(` + user['id'] + `)" style="margin: 10px; cursor: pointer; margin-bottom: 20px;">
                <div style="display: flex;">
                    <div style="margin-left: 5px; float: left;">
                        <img style="width: 50px; height: 50px; border-radius: 50%; border: 1px solid black;"
                            src="images/icon_doge.jpeg" alt="User Icon">
                    </div>
                    <div style="display: block; margin-left: 10px; cursor: pointer; width: 100%;">
                        <div style="display: flex;">
                            <div style="display: block;">
                                <div style="font-size: 16px; font-weight: 600;">` + user['user_name'] + `</div>
                                <div style="color: rgb(110, 110, 110); font-weight: 500;">@` + user['mention_name'] + `</div>
                            </div>
                            ` + getFollowButton(user['id']) + `
                        </div>
                        <div style="margin-top: 5px; font: Trebuchet MS, Helvetica, sans-serif; font-size: 14px; font-weight: 500;">` +
                            user['status']
                        + `</div>
                    </div>                        
                </div>
            </div>
            <hr style="margin: 0 0;">
        </div>
    `;
}

$(function() {
    
    const uri = decodeURIComponent(window.location.search);
    const qp = getQueryKVMap(uri);
    
    var index = qp.get('i');
    var user_id = qp.get('id');

    console.log(index, user_id);

    function navClick(e) {

        $('#profile-follower-feeds-spinner').show();

        var currId = this.id[this.id.length - 1];

        document.getElementById("profile-follower-qqq-nav-title-" + prevId).style.fontSize = "14px";
        document.getElementById("profile-follower-qqq-nav-title-" + prevId).style.fontWeight = "500";
        document.getElementById("profile-follower-qqq-nav-title-" + prevId).style.color = "rgb(110, 110, 110)";   
        $("#profile-follower-qqq-nav-bottom-bar-" + prevId).hide();
        $("#profile-follower-qqq-container-" + prevId).hide();

        document.getElementById("profile-follower-qqq-nav-title-" + currId).style.fontSize = "16px";
        document.getElementById("profile-follower-qqq-nav-title-" + currId).style.fontWeight = "600";
        document.getElementById("profile-follower-qqq-nav-title-" + currId).style.color = "black";
        $("#profile-follower-qqq-nav-bottom-bar-" + currId).show();
        $("#profile-follower-qqq-container-" + currId).show();

        prevId = currId;

        return false;

    }

    for (let i = 2; ~i; i--)
        $("#profile-follower-qqq-container-" + i).click(navClick);

    $("#profile-follower-qqq-container-" + index).click();


    const controller = [
        getProfileTweetController(0, user),
        getProfileTweetController(1, user),
        getProfileTweetController(2, user),
        getProfileTweetController(3, user)
    ];

    const observer = respondToVisibility(document.getElementById('profile-follower-feeds-spinner'), visibile => {
        if (!visibile)
            return;

        loadMore(controller[prevId]);
        
    })

})

function loadMore(controller) {

    if (controller.endReached) {
        $('#profile-follower-feeds-spinner').hide();
        return;
    }

    function endReached() {

        console.log("END DA " + controller.index);

        $('#profile-follower-feeds-spinner').hide();

        if (controller.pageNo == 0) {

            // TODO
            // $('#profile-follower-qqq-container-' + controller.index).append();

        }

        controller.endReached = true;

    }

    $.ajax({
        url: base_url + "tweet/tprofile?user_id=" + controller.user['id'] +"&minTs=" + controller.minTS + "&size=" + (controller.pageSize+1) + "&start=" + controller.pageNo + "&index=" + controller.index,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(users) {

            if (users == null || users.length == 0) {
                console.log("END REACHED DA!!! NO MORE TWEETS FOR PROFILE AT " + controller.index + "!!!!");
                endReached();
                return;
            }

            for (const user of users.slice(0, users.length > controller.pageSize ? -1 : undefined)) {

                $('#profile-follower-qqq-container-' + controller.index).append(getUserProfileFollowerCell(user));
                
            }

            controller.pageNo += controller.pageSize;

            if (users.length <= controller.pageSize)
                endReached();

        }, error: function(request, status, error) {
            console.log('profile-follower-loadMore' + controller.index, request.responseText, status, error);
        }, complete: function() {
        }
    })
}