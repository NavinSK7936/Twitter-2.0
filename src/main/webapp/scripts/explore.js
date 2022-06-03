function getExploreController(index) {
    return {
        index: index,
        pageNo: 0,
        pageSize: 10,
        minTS: getTimestampFormattedValue(new Date()),
        endReached: false
    }
}

function getProfileFollowButton() {

    const obj = $($.parseHTML(`
        <div style="cursor: pointer; position: absolute; right: 30%; display: flex; margin-top: 10px; margin-right: 10px;">
            <div style="border-radius: 9999px; border: 1px solid black; padding: 5px 15px; font-weight: 650;">
                Follow
            </div>
        </div>
    `));

    obj.click(function() {
        justClick(0, 99);
    })

    console.log(obj[0]);

    return obj[0];
}

$(function() {

    callDestructor(function() {
        showUI($('#explore-filter-container'), false);
    })

    showUI($('#explore-filter-container'));

    const user_id = getCurrentUserIdInLS();

    const uri = decodeURIComponent(window.location.search);
    const qp = getQueryKVMap(uri);
    const search = encodeURIComponent(qp.get('q'));

    console.log('kkkl', uri, qp, search);
    setTopAppBar({ title: null, subTitle: null, showBackButton: true, showSearchBox: true });


    $('#top-app-bar-search-input-field').val(qp.get('q') + ' ');

    // HIDE THE SEARCH AND CANCEL BUTTONS
    showUI($('#top-app-bar-search-button'), false);
    showUI($('#top-app-bar-search-cancel-button'), false);


    var prevId = 0;
    function navClick(e) {

        $('#exploreSpinnerId').show();

        var currId = this.id[this.id.length - 1];

        document.getElementById("explore-nav-title-" + prevId).style.fontSize = "14px";
        document.getElementById("explore-nav-title-" + prevId).style.fontWeight = "500";
        document.getElementById("explore-nav-title-" + prevId).style.color = "rgb(110, 110, 110)";                
        $("#explore-nav-bottom-bar-" + prevId).hide();
        $("#explore-qqqq-container-" + prevId).hide();

        document.getElementById("explore-nav-title-" + currId).style.fontSize = "16px";
        document.getElementById("explore-nav-title-" + currId).style.fontWeight = "600";
        document.getElementById("explore-nav-title-" + currId).style.color = "black";
        $("#explore-nav-bottom-bar-" + currId).show();
        $("#explore-qqqq-container-" + currId).show();

        prevId = currId;

        return false;

    }

    for (let i = 2; ~i; i--)
        $("#explore-nav-" + i).click(navClick);
    
    $("#explore-nav-0").click();

    const controller = [
        getExploreController(0),
        getExploreController(1),
        getExploreController(2)
    ];

    const exploreObserver = respondToVisibility(document.getElementById('exploreSpinnerId'), visibile => {

        if (!visibile)
            return;

        console.log('yep logged');

        loadMore1(controller[prevId], user_id, search, exploreFilter);        
        
    })    

})

function loadMore1(controller, user_id, search, filter) {

    if (controller.endReached) {
        $('#exploreSpinnerId').hide();
        return;
    }

    function endReached() {

        console.log("END EXPLORE DA " + controller.index);

        $('#exploreSpinnerId').hide();

        $('#explore-qqqq-container-' + controller.index).append(
            controller.pageNo ? getContentEndPlaceholder(endReachedTitles) : 
                getContentEmptyPlaceholder(nothingToShowInProfileTweetsTitles(
                    controller.index == 0 ? "Try to revise the search and filter parameters!!!" :
                    controller.index == 1 ? "Try to revise the search and filter parameters!!!" :
                                            "Try to revise the search and filter parameters!!!")));

        controller.endReached = true;

    }

    console.log(controller);
    console.log(filter);

    // $('#explore-qqqq-container-' + controller.index).empty();

    if (controller.index == 2) {
        console.log("tweet/texplore/people?user_id=" + user_id +
                    "&q=" + search +
                    "&cfrom=" + filter.cfrom +
                    "&creply=" + filter.creply +
                    "&likes=" + filter.likes +
                    "&replies=" + filter.replies +
                    "&retweets=" + filter.retweets +
                    "&minTs=" + controller.minTS +
                    "&from=" + filter.from +
                    "&to=" + filter.to +
                    "&start=" + controller.pageNo +
                    "&size=" + (controller.pageSize+1));
        $.ajax({
            url: base_url + "tweet/texplore/people?user_id=" + user_id +
                            "&q=" + search +
                            "&cfrom=" + filter.cfrom +
                            "&creply=" + filter.creply +
                            "&likes=" + filter.likes +
                            "&replies=" + filter.replies +
                            "&retweets=" + filter.retweets +
                            "&minTs=" + controller.minTS +
                            "&from=" + filter.from +
                            "&to=" + filter.to +
                            "&start=" + controller.pageNo +
                            "&size=" + (controller.pageSize+1)
                            ,
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(users) {

                if (users == null || users.length == 0) {
                    console.log("END REACHED DA!!! NO MORE TWEETS FOR EXPLORE AT " + controller.index + "!!!!");
                    endReached();
                    return;
                }

                for (const user of users) {

                    $('#explore-qqqq-container-' + controller.index).append(getUserAsPeople(user));

                }

                controller.pageNo += controller.pageSize;

                if (users.length <= controller.pageSize)
                    endReached();

            }, error: function(request, status, error) {
                console.log('explore-people-' + controller.index, request.responseText, status, error);
            }, complete: function() {
            }
        })
    } else {
        console.log(base_url + "tweet/texplore?user_id=" + user_id +
                    "&q=" + search +
                    "&cfrom=" + filter.cfrom +
                    "&creply=" + filter.creply +
                    "&likes=" + filter.likes +
                    "&replies=" + filter.replies +
                    "&retweets=" + filter.retweets +
                    "&minTs=" + controller.minTS +
                    "&from=" + filter.from +
                    "&to=" + filter.to +
                    "&start=" + controller.pageNo +
                    "&size=" + (controller.pageSize+1) +
                    "&order=" + (controller.index == 0 ? "TOP" : "RECENT"));

        $.ajax({
            url: base_url + "tweet/texplore?user_id=" + user_id +
                            "&q=" + search +
                            "&cfrom=" + filter.cfrom +
                            "&creply=" + filter.creply +
                            "&likes=" + filter.likes +
                            "&replies=" + filter.replies +
                            "&retweets=" + filter.retweets +
                            "&minTs=" + controller.minTS +
                            "&from=" + filter.from +
                            "&to=" + filter.to +
                            "&start=" + controller.pageNo +
                            "&size=" + (controller.pageSize+1) +
                            "&order=" + (controller.index == 0 ? "TOP" : "RECENT")
                            ,
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(tweetPieces) {

                if (tweetPieces == null || tweetPieces.length == 0) {
                    console.log("END REACHED DA!!! NO MORE TWEETS FOR EXPLORE AT " + controller.index + "!!!!");
                    endReached();
                    return;
                }

                console.log(tweetPieces);

                for (const tweetPiece of tweetPieces.slice(0, tweetPieces.length > controller.pageSize ? -1 : undefined)) {

                    if (tweetPiece['type'] == "QUOTED")
                        $('#explore-qqqq-container-' + controller.index).append(getQuotedRetweet(tweetPiece['parent'], tweetPiece['child']));
                    else if (tweetPiece['type'] == "RETWEET")
                        $('#explore-qqqq-container-' + controller.index).append(getRetweet(user_id, tweetPiece['parent'], tweetPiece['child']));
                    else if (tweetPiece['type'] == "REPLY")
                        $('#explore-qqqq-container-' + controller.index).append(getReply(tweetPiece['parent'], tweetPiece['child']));
                    else
                        $('#explore-qqqq-container-' + controller.index).append(getSingleTweetForSecondColumnTweetsContainer(tweetPiece['child']['tweet'], tweetPiece['child']['user']));
                    
                }

                controller.pageNo += controller.pageSize;

                if (tweetPieces.length <= controller.pageSize)
                    endReached();

            }, error: function(request, status, error) {
                console.log('explore-' + controller.index, request.responseText, status, error);
            }, complete: function() {
            }
        })
    }
}
