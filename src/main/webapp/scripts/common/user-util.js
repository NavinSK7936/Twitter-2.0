function setCurrentUserIdInLS(userId) {
	localStorage.setItem(currentSignedInUserKey, userId);
}

function getCurrentUserIdInLS() {
	return localStorage.getItem(currentSignedInUserKey);
}

function relateUsers(from_user, to_user) {

    console.log('gonna-relate', from_user, to_user);

    $.ajax({
		url: base_url + "user/relate?from_user=" + from_user + "&to_user=" + to_user,
		type: "POST",
		contentType: "application/json; charSet=UTF-8",
		dataType: "json",
		timeout: 2500,
		success: function(result) {

            console.log('users-related', from_user, to_user, result);

        }, error: function(request, status, error) {
			console.log('addTweetsInUserProfileContainer', request.responseText, status, error);
		}, complete: function() {
		}
	})
}

function getUserProfileFollowerCell(user, that_user_id) {

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
        // return `
        //     <div onclick="exploreFollowButtonClick(this, event, ` + user_id + `)" data-is-following="` + isFollowing + `" style="margin-top: 0px; margin-left: 70%;">
        //         <div style="border-radius: 9999px; border: 1px solid black; padding: 6px 20px; font-weight: 650; cursor: pointer;" class="center-items">
        //             ` + (isFollowing ? 'Following' : 'Follow') + `
        //         </div>
        //     </div>
        // `;

    }

    return `
        <div style="padding-top: 10px;">
                            
            <div onclick="takeToUserProfileFromProfileFollower(${user['id']}, ${that_user_id})" style="display: flex; cursor: pointer;">

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

    // return `
    //     <div>
    //         <div onclick="takeToUserProfile(` + user['id'] + `)" style="margin: 10px; cursor: pointer; margin-bottom: 20px;">
    //             <div style="display: flex;">
    //                 <div style="margin-left: 5px; float: left;">
    //                     <img style="width: 50px; height: 50px; border-radius: 50%; border: 1px solid black;"
    //                         src="images/icon_doge.jpeg" alt="User Icon">
    //                 </div>
    //                 <div style="display: block; margin-left: 10px; cursor: pointer; width: 100%;">
    //                     <div style="display: flex;">
    //                         <div style="display: block;">
    //                             <div style="font-size: 16px; font-weight: 600;">` + user['user_name'] + `</div>
    //                             <div style="color: rgb(110, 110, 110); font-weight: 500;">@` + user['mention_name'] + `</div>
    //                         </div>
    //                         ` + getFollowButton(user['id']) + `
    //                     </div>
    //                     <div style="margin-top: 5px; font: Trebuchet MS, Helvetica, sans-serif; font-size: 14px; font-weight: 500;">` +
    //                         getResultWithHashtags(user['status'])
    //                     + `</div>
    //                 </div>                        
    //             </div>
    //         </div>
    //         <hr style="margin: 0 0;">
    //     </div>
    // `;
}