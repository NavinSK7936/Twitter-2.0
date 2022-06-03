
// SELECT * FROM tweet_table WHERE id IN (SELECT tweet_id FROM hash_tweet_table WHERE hashtag_id IN (SELECT id FROM hashtags_table WHERE hashtag REGEXP 'dorsey|java'))

// SELECT * FROM tweet_table WHERE user_id IN (SELECT id FROM user_table WHERE mention_name REGEXP 'navinsk7936|beiber2727')

// SELECT * FROM tweet_table WHERE id IN (SELECT tweet_id FROM mention_tweet_table WHERE user_id IN (SELECT id FROM user_table WHERE mention_name REGEXP 'navinsk7936|beiber2727'))

// SELECT * FROM tweet_table WHERE id IN (SELECT tweet_id FROM hash_tweet_table WHERE hashtag_id IN (SELECT id FROM hashtags_table WHERE hashtag REGEXP 'dorsey|java') UNION (SELECT tweet_id FROM mention_tweet_table WHERE user_id IN (SELECT id FROM user_table WHERE mention_name REGEXP 'navinsk7936|beiber2727'))) OR user_id IN (SELECT id FROM user_table WHERE mention_name REGEXP 'navinsk7936|beiber2727') ORDER BY total_likes DESC, total_replies DESC, total_retweets DESC;



var prevTopBarVals = null;

function overlapPositionOfRetweetQQQQDiv(toOverlap= true) {
        
    if (toOverlap == false) {
        // TO again show back Retweet in QQQQ to get hid
        $('.dropdown[data-type="retweetIconDivQQQQ"]').css('position', 'relative');
    } else {
        // TO HIDE Retweet in QQQQ to show dropdown
        $('.dropdown[data-type="retweetIconDivQQQQ"]').css('position', 'static');
        $('.dropdown[data-type="retweetIconDivQQQQ"]').removeClass('open');
    }
    
}

$(function() {

    $('html').click(function(event) {

        const qp = getQueryKVMap(decodeURIComponent(window.location.search));

        if (qp.get('p') == 'explore') {
            
            showUI($('#top-app-bar-search-dropdown'), false);
            overlapPositionOfRetweetQQQQDiv(false);

            // TO remove Highlight border on search
            $('#top-app-bar-search-div').removeClass('top-app-bar-search-box-onfocus');

            return;
        }

        searchOnFocusOut(event);

    })

    let currStr = '';
    let searchPageStart = 0, searchPageSize = 5;

    const topAppBarSearchObserver = respondToVisibility(document.getElementById('top-app-bar-search-loading-div'), visible => {

        console.log(visible);
        if (!visible)
            return;
        else if (currStr == '') {
            console.log();
            trendingCallback();
        } else if (currStr[0] == '@') {
            mentionCallback(currStr);
        } else if (currStr[0] == '#') {
            hashtagCallback(currStr);
        } else {
            showNoSearchResultsFound(false);
        }
        
    });

    function trendingCallback() {
        $.ajax({
            url: base_url + "tweet/hashtags/trending?limit=" + 5,
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(hashtagsMap) {

                const keys = Object.keys(hashtagsMap);

                if (keys.length == 0) {
                    showNoSearchResultsFound(true, true);
                    return;
                }

                for (const key of keys.slice(0, keys.length > searchPageSize ? -1 : undefined))
                    $('#top-app-bar-search-trending-container').append(getSearchHashCell(key, hashtagsMap[key]));

                searchPageStart += searchPageSize;

                if (keys.length <= searchPageSize)
                    showNoSearchResultsFound(false, true);

            }, error: function(request, status, error) {
                console.log('top bar hashtag search:', request.responseText, status, error);
            }, complete: function() {
            }
        })
    }

    function hashtagCallback(currStr) {
        $.ajax({
            url: base_url + "tweet/hashtags?wildcard=" + encodeURIComponent(currStr.substring(1)) + "&start=" + searchPageStart + "&size=" + (searchPageSize+1),
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(hashtagsMap) {

                const keys = Object.keys(hashtagsMap);

                if (keys.length == 0) {
                    showNoSearchResultsFound();
                    return;
                }

                for (const key of keys.slice(0, keys.length > searchPageSize ? -1 : undefined))
                    $('#top-app-bar-search-trending-container').append(getSearchHashCell(key, hashtagsMap[key]));

                searchPageStart += searchPageSize;

                if (keys.length <= searchPageSize)
                    showNoSearchResultsFound(false);

            }, error: function(request, status, error) {
                console.log('top bar hashtag search:', request.responseText, status, error);
            }, complete: function() {
            }
        })
    }

    function mentionCallback(currStr) {
        $.ajax({
            url: base_url + "user/rmentions?wildcard=" + encodeURIComponent(currStr.substring(1)) + "&start=" + searchPageStart + "&size=" + (searchPageSize+1),
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(users) {

                if (users.length == 0) {
                    showNoSearchResultsFound();
                    return;
                }

                for (const user of users.slice(0, users.length > searchPageSize ? -1 : undefined))
                    $('#top-app-bar-search-trending-container').append(getSearchUserCell(user));

                searchPageStart += searchPageSize;

                if (users.length <= searchPageSize)
                    showNoSearchResultsFound(false);

            }, error: function(request, status, error) {
                console.log('top bar mention search:', request.responseText, status, error);
            }, complete: function() {
            }
        })
    }

    function searchChanged(event) {

        event.stopPropagation();
        
        const elem = $('#top-app-bar-search-input-field');

        console.log('focusin', elem);

        // TO add Highlight border on search
        $('#top-app-bar-search-div').addClass('top-app-bar-search-box-onfocus');

        if (elem.val() == '' || elem.data('oldVal') != elem.val()) {

            let oldVal = elem.data('oldVal');
            let newVal = elem.val();
            currStr = '';

            // Updated stored value
            elem.data('oldVal', elem.val());

            if (newVal.slice(-1) == ' ') {
                currStr = '';

                console.log('SPACE ENTERED');

                showUI($('#top-app-bar-search-dropdown'), false);
                overlapPositionOfRetweetQQQQDiv(false);

            } else if (elem.val() == '') {

                console.log("EMPTY SEARCH");

                $('#top-app-bar-search-trending-container').empty();
                
                showUI($('#top-app-bar-search-dropdown'));
                overlapPositionOfRetweetQQQQDiv();

                showUI($('#top-app-bar-search-parent-container'));
                showUI($('#top-app-bar-search-trending-bar'));
                showUI($('#top-app-bar-search-loading-div'));

            } else {
                currStr = newVal.split(' ').at(-1);

                searchPageStart = 0;

                $('#top-app-bar-search-trending-container').empty();
                showUI($('#top-app-bar-search-nothing-found'), false);
                showUI($('#top-app-bar-search-parent-container'), false);
                
                showUI($('#top-app-bar-search-dropdown'));
                overlapPositionOfRetweetQQQQDiv();

                showUI($('#top-app-bar-search-trending-bar'));
                showUI($('#top-app-bar-search-loading-div'));

                // $('#top-app-bar-search-trending-bar-title').text('Suggested');

            }

        }
    }

    function searchOnFocusIn(event) {

        const currTopBarVals = $('#second-top-bar').data('top-bar-vals');
        if (!currTopBarVals.showSearchBox) {
            // console.log('Focus IN', prevTopBarVals);
            prevTopBarVals = currTopBarVals;
            setTopAppBar({ title: null, subTitle: null, showBackButton: true, showSearchBox: true, followText: null });
        }

        // TO add Highlight border on search
        $('#top-app-bar-search-div').addClass('top-app-bar-search-box-onfocus');

        showUI($('#top-app-bar-search-button'), false);
        showUI($('#top-app-bar-search-cancel-button'));
        
        showUI($('#top-app-bar-search-dropdown'));
        overlapPositionOfRetweetQQQQDiv();

        $('#top-app-bar-search-input-field').focus();

        searchChanged(event);

    }

    function searchOnFocusOut(event) {

        if ($('#top-app-bar-search-box').is(':visible') == false) {
            prevTopBarVals = null;
            return;
        }

        // TO remove Highlight border on search
        $('#top-app-bar-search-div').removeClass('top-app-bar-search-box-onfocus');
        
        // if ($('#top-app-bar-search-dropdown').is(':visible')) {
        //     return;
        // }

        setTopAppBar(prevTopBarVals);

        showUI($('#top-app-bar-search-box'), false);
        showUI($('#top-app-bar-search-button'));
        showUI($('#top-app-bar-search-cancel-button'), false);
        
        showUI($('#top-app-bar-search-dropdown'), false);
        overlapPositionOfRetweetQQQQDiv(false);

    }

    $('#top-app-bar-search-input-field').each(function() {
        var elem = $(this);
        elem.data('oldVal', elem.val());
        elem.bind("propertychange change click keyup input paste", searchChanged);
    });

    $('#top-app-bar-search-button').click(function(event) {

        // console.log('search clicked');
        event.stopPropagation();
        $('#top-app-bar-search-input-field').trigger('focusin');

        searchOnFocusIn(event);
        
    })

    $('#top-app-bar-search-cancel-button').click(function(event) {

        // console.log('cancel clicked');
        event.stopPropagation();
        $('#top-app-bar-search-input-field').trigger('focusout');

        searchOnFocusOut(event);

    })
    
    $('#top-app-bar-back-button').click(function(event) {
        event.stopPropagation();
        console.log('lki@@', $('#top-app-bar-search-dropdown').is(':visible'));
        if ($('#top-app-bar-search-dropdown').is(':visible')) {
            showUI($('#top-app-bar-search-dropdown'), false);
            overlapPositionOfRetweetQQQQDiv(false);
        }
        else
            history.back();
    })

    $('#top-bar-actual-search').click(function(event) {
        event.stopPropagation();

        // TO remove Highlight border on search
        $('#top-app-bar-search-div').removeClass('top-app-bar-search-box-onfocus');

        showExploreSection('p=explore&q=' + $('#top-app-bar-search-input-field').val().trim());

    })

    $("#top-app-bar-search-input-field").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            $(this).blur();
            $('#top-bar-actual-search').click();
        }
    });

    $('#top-app-bar-search-input-field').on('click', function(event) {

        console.log('input', event);
    })

})

// title(null to hide), subTitle(null to hide), showBackButton, showSearchBox, followText(Follow or Following), showDropdown
function setTopAppBar(c) {

    if (c == null)
        return;


    if (c.title) {
        showUI($('#top-app-bar-title'));
        $('#top-app-bar-title').text(c.title);
    } else if (c.title == null) {
        showUI($('#top-app-bar-title'), false);
    }


    if (c.subTitle) {
        showUI($('#top-app-bar-sub-title'));
        $('#top-app-bar-sub-title').text(c.subTitle);
    } else if(c.subTitle == null) {
        showUI($('#top-app-bar-sub-title'), false);
    }

    
    if (c.showBackButton) {
        showUI($('#top-app-bar-back-button'));
    } else if (c.showBackButton == false) {
        showUI($('#top-app-bar-back-button'), false);
    }


    if (c.showSearchBox) {
        showUI($('#top-app-bar-search-box'));
    } else if (c.showSearchBox == null) {
        showUI($('#top-app-bar-search-box'), false);
    }


    if (c.followText) {
        showUI($('#top-app-bar-follow-button'));
        $('#top-app-bar-follow-button').text(c.followText);
    } else if (c.followText == null) {
        showUI($('#top-app-bar-follow-button'), false);
    }


    // if (c.showDropdown)
    //     showUI($('#top-app-bar-search-dropdown'));
    // else
    //     showUI($('#top-app-bar-search-dropdown'), false);

    
    showUI($('#top-app-bar-search-button'));
    showUI($('#top-app-bar-search-cancel-button'), false);
    
    showUI($('#top-app-bar-search-dropdown'), false);
    overlapPositionOfRetweetQQQQDiv(false);


    $('#second-top-bar').data('top-bar-vals', c);
    console.log(c);
    
}