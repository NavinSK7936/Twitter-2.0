
let destructor = null;

function callDestructor(newDestructor = null) {
    destructor?.();
    destructor = newDestructor;
}

function justDoIt(toPush = true) {

    const qp = getQueryKVMap(decodeURIComponent(window.location.search));

    console.log(window.history);
    console.log(decodeURIComponent(window.location.search));

    if (qp.size == 0 || qp.get('p') == 'home') {

        setHomePage(toPush, qp.size == 0);

    } else if (qp.get('p') == 'profile') {

        if (qp.get('id') == undefined) {
            // NO id mentioned
        } else {

            console.log(toPush, +qp.get('id'));

            showUserProfile(toPush, +qp.get('id'));

        }

    } else if (qp.get('p') == 'explore') {

        showExploreSection(decodeURIComponent(window.location.search.substring(1)), toPush ? 'push' : 'replace');

    } else if (qp.get('p') == 'follower') {

        showFollowerTopLayer(qp.get('i'), qp.get('id'));

    }

}


$(function() {

    // console.log(window.location);

    const onScrollEvents = [];

    window.onscroll = function (e) {  
        for (const event of onScrollEvents)
            event();
    }

    const htmlClicks = []

    $('html').click(function(e) {
        for (const click of htmlClicks)
            click();
    })



    const userId = getCurrentUserIdInLS();

    if (window.history && window.history.pushState) {

        // window.history.pushState('forward', null, './#forward');
    
        $(window).on('popstate', function() {

            justDoIt(false);

        });
    
    }

    // @TODO
    if (userId == null) {

        console.log('NULL USER');
        window.location.href = 'html/login.html';

    } else {

        initFirstColumn(userId);

        justDoIt();

    }

})

function initFirstColumn(user_id) {

    $('#first-home-button-id').click(function () {
        setHomePage();
    })

    $('#first-profile-button-id').click(function () {
        showUserProfile(true, user_id);
    })
}

function setHomePage(toPush = true, isStart = false) {

    $('#second-body').empty();

    $('#second-body').load('html/home.html');

    if (isStart)
        window.history.replaceState(null, "Home", "?p=home");
    else if (toPush)
        window.history.pushState(null, "Home", "?p=home");

}

function showUserProfile(toPush = true, user_id = getCurrentUserIdInLS()) {

    $('#second-body').empty();

    $('#second-body').load('html/profile.html');

    if (toPush)
        window.history.pushState(null, "Home", "?p=profile&id=" + user_id);

}

function showExploreSection(searchQuery, to = 'push') {

    $('#second-body').empty();

    $('#second-body').load('html/explore.html');

    searchQuery = '?' + encodeURIComponent(searchQuery);

    if (to == 'push')
        window.history.pushState(null, "Explore", searchQuery);
    else if (to == 'replace')
        window.history.replaceState(null, "Explore", searchQuery);

}

function showFollowerTopLayer(index, user_id, to = 'push') {

    $('#auxiliary-container').empty();

    $('#auxiliary-container').load('html/profile-follower.html');

    if (to == 'push')
        window.history.pushState(null, "FollowerTopLayer", "?p=follower&id=" + user_id + "&i=" + index);
    else if (to == 'replace')
        window.history.replaceState(null, "FollowerTopLayer", "?p=follower&id=" + user_id + "&i=" + index);

}

function logout() {

}

