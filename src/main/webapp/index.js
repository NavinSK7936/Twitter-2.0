
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

        // const exploreFilter = {
        //     q: qp.get('q'),
        //     cfrom: qp.get('cfrom'), // anyone || only-followers
        //     creply: qp.get('creply'), // only-replies || both
        //     replies: qp.get('replies'),
        //     retweets: qp.get('retweets'),
        //     likes: qp.get('likes'),
        //     from: qp.get('from'),
        //     to: qp.get('to')
        // }

        console.log('pop', decodeURIComponent(window.location.search.substring(1)));

        showExploreSection(decodeURIComponent(window.location.search.substring(1)), toPush ? 'push' : 'replace');

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

function logout() {

}

