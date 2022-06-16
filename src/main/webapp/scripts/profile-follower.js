function takeToUserProfileFromProfileFollower(user_id, that_user_id) {
    
    window.history.replaceState(null, "Profile", "?p=profile&id=" + that_user_id);

    takeToUserProfile(user_id);

}

function getProfileFollowerController(index, user_id) {
    return {
        user_id: user_id,
        index: index,
        pageNo: 0,
        pageSize: 10,
        endReached: false,
        callback: function() {

            if (this.endReached)
                return;

            var controller = this;

            function endReachedCallback() {

                console.log("END DA " + controller.index);
            
                $('#profile-follower-feeds-spinner').hide();
        
                if (controller.pageNo == 0) {

                    $('#profile-follower-qqq-container-' + controller.index).append(
                        `<div style="text-align: center; height: auto; transform: translate(0%, 20%); margin: 50px auto; padding: 10px;">
                            <div style="display: inline-block; margin-bottom: 10px;">
                                <img style="width: 130px; height: 130px;" src="images/no_one_to_find.png">
                            </div>
                            <div style="font-size: 22px; font-weight: 900;">NONE TO FIND</div>
                            <div style="font-size: 16px; font-weight: 500; color: rgb(110, 110, 110); white-space: pre;">` + (controller.index == 0 ? 'Is this Social Distancing?' : 'Be the first to follow!') + `</div>
                        </div>`
                    );
        
                }
        
                controller.endReached = true;
            }

            if (controller.index == 0) {
                $.ajax({
                    url: base_url + "user/profile/followees?user_id=" + getCurrentUserIdInLS() + "&follower_id=" + controller.user_id + "&start=" + controller.pageNo + "&size=" + (controller.pageSize+1),
                    type: "GET",
                    contentType: "application/json; charSet=UTF-8",
                    dataType: "json",
                    timeout: 2500,
                    success: function(users) {

                        if (users == null || users.length == 0) {
                            console.log("END REACHED DA!!! AT " + controller.index + "!!!!");
                            endReachedCallback();
                            return;
                        }

                        for (const user of users.slice(0, users.length > controller.pageSize ? -1 : undefined)) {
            
                            $('#profile-follower-qqq-container-' + controller.index).append(getUserProfileFollowerCell(user, controller.user_id));
                            
                        }
            
                        controller.pageNo += controller.pageSize;
            
                        if (users.length <= controller.pageSize)
                            endReachedCallback();
            
                    }, error: function(request, status, error) {
                        console.log('profile-followee-loadMore' + controller.index, request.responseText, status, error);
                    }, complete: function() {
                    }
                })
            } else if (controller.index == 1) {
                $.ajax({
                    url: base_url + "user/profile/followers?user_id=" + getCurrentUserIdInLS() + "&followee_id=" + controller.user_id + "&start=" + controller.pageNo + "&size=" + (controller.pageSize+1),
                    type: "GET",
                    contentType: "application/json; charSet=UTF-8",
                    dataType: "json",
                    timeout: 2500,
                    success: function(users) {

                        if (users == null || users.length == 0) {
                            console.log("END REACHED DA!!! AT " + controller.index + "!!!!");
                            endReachedCallback();
                            return;
                        }

                        for (const user of users.slice(0, users.length > controller.pageSize ? -1 : undefined)) {
            
                            $('#profile-follower-qqq-container-' + controller.index).append(getUserProfileFollowerCell(user, controller.user_id));
                            
                        }
            
                        controller.pageNo += controller.pageSize;
            
                        if (users.length <= controller.pageSize)
                            endReachedCallback();
            
                    }, error: function(request, status, error) {
                        console.log('profile-follower-loadMore' + controller.index, request.responseText, status, error);
                    }, complete: function() {
                    }
                })
            } else {
                $.ajax({
                    url: base_url + "user/profile/followers/known?user_id=" + getCurrentUserIdInLS() + "&that_id=" + controller.user_id + "&start=" + controller.pageNo + "&size=" + (controller.pageSize+1),
                    type: "GET",
                    contentType: "application/json; charSet=UTF-8",
                    dataType: "json",
                    timeout: 2500,
                    success: function(users) {

                        if (users == null || users.length == 0) {
                            console.log("END REACHED DA!!! AT " + controller.index + "!!!!");
                            endReachedCallback();
                            return;
                        }

                        for (const user of users.slice(0, users.length > controller.pageSize ? -1 : undefined)) {
            
                            $('#profile-follower-qqq-container-' + controller.index).append(getUserProfileFollowerCell(user, controller.user_id));
                            
                        }
            
                        controller.pageNo += controller.pageSize;
            
                        if (users.length <= controller.pageSize)
                            endReachedCallback();
            
                    }, error: function(request, status, error) {
                        console.log('profile-follower-known' + controller.index, request.responseText, status, error);
                    }, complete: function() {
                    }
                })
            }

        }
    }
}





$(function() {
    
    const uri = decodeURIComponent(window.location.search);
    const qp = getQueryKVMap(uri);
    
    var that_user_id = qp.get('id');
    var index = qp.get('pfi');

    
    $('#profile-follower-qqq-back-button').click(function() {

        $('#auxiliary-container').empty();

        window.history.replaceState(null, "showFollowerTopLayer", getSearchQueryFromMap(removeQueryParam('pfi')));

    })

    $('#profile-follower-qqq-div').click(function() {

        $('#auxiliary-container').empty();

        window.history.replaceState(null, "showFollowerTopLayer", getSearchQueryFromMap(removeQueryParam('pfi')));

    })

    $.ajax({
        url: base_url + "user/id/" + that_user_id,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(user) {

            $('#profile-follower-qqq-user-name').text(user['user_name']);
            $('#profile-follower-qqq-mention-name').text(user['mention_name']);

        }, error: function(request, status, error) {
            console.log('profile-follower-user', request.responseText, status, error);
        }, complete: function() {
        }
    })

    var prevId = 0;

    function navClick(event) {

        event.stopPropagation();

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

        window.history.replaceState(null, "showFollowerTopLayer", '?p=profile&id=' + that_user_id + "&pfi=" + currId);

        prevId = currId;

        return false;

    }

    // Check whether there is a known follower for that_user
    $.ajax({
        url: base_url + "user/profile/followers/known?user_id=" + getCurrentUserIdInLS() + "&that_id=" + that_user_id + "&start=" + 0 + "&size=" + 1,
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(users) {

            let i = 2;

            if (users == null || users.length == 0) {
                showUI($('#profile-follower-qqq-nav-2'), false);
                i = 1;
                if (index != 0 && index != 1)
                    index = 0;
            } else if (index < 0 || index > 2) {
                index = 0;
            }

            console.log('users', users, index, i);
            
            for (; ~i; $("#profile-follower-qqq-nav-" + i--).click(navClick));

            $("#profile-follower-qqq-nav-" + index).click();

            window.history.replaceState(null, "showFollowerTopLayer", '?p=profile&id=' + that_user_id + "&pfi=" + index);

        }, error: function(request, status, error) {
            console.log('profile-follower-known-check', request.responseText, status, error);
        }, complete: function() {
        }
    })

    

    const controller = [
        getProfileFollowerController(0, that_user_id),
        getProfileFollowerController(1, that_user_id),
        getProfileFollowerController(2, that_user_id)
    ];

    const profileFollowerObserver = respondToVisibility(document.getElementById('profile-follower-feeds-spinner'), visibile => {
        if (!visibile)
            return;

        loadMoreForProfileFollower(controller[prevId]);
        
    })

})

function loadMoreForProfileFollower(controller) {

    if (controller.endReached) {
        $('#profile-follower-feeds-spinner').hide();
        return;
    }

    controller.callback();
    
}