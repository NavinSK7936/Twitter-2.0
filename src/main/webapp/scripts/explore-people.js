function getExplorePeopleFollowButton(user_id) {

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
            console.log('isFollowing: ', request.responseText, status, error);
        }, complete: function() {
        }
    })

    return `
        <div onclick="followButtonClick(0, ` + user_id + `)" style="position: absolute; right: 30%; display: flex; margin-top: 10px; margin-right: 10px;">
            <div id="second-user-profile-follow-button-id" style="cursor: pointer; border-radius: 9999px; border: 1px solid black; padding: 5px 15px; font-weight: 650;">` + (isFollowing ? 'Following' : 'Follow') + `</div>
        </div>
    `;
}

style="margin-top: 0px; margin-right: 20px; margin-left: 70%;"

function getPeopleCell(user) {
    return `
        <div style="padding: 10px;">
            <div style="display: flex;">
                <div style="margin-right: 10px;">
                    <img style="cursor: pointer; width: 50px; height: 50px; border-radius: 50%;"
                        src="images/default_profile.png" alt="User Icon">
                </div>
                <div style="width: 100%;">
                    <div style="display: flex; align-items: center; margin-bottom: 3px;">
                        <div>
                            <div style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black;" href="#" role="link">
                                <span id="tweet-time">` + user['user_name'] + `</span>
                            </div>
                            <div style="cursor: pointer; font-size: 15px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
                                <span id="tweet-time">@` + user['mention_name'] + `</span>
                            </div>
                        </div>
                        <div style="cursor: pointer; position: absolute; right: 30%; display: flex; margin-top: 10px; margin-right: 10px;">
                            <div style="border-radius: 9999px; border: 1px solid black; padding: 5px 15px; font-weight: 650;">
                                Follow
                            </div>
                        </div>
                    </div>

                    <div style="font-size: 16px; font-weight: 440;">
                        First tweet LOL! 
                    </div>

                </div>
            </div>
        </div>
    `;
}