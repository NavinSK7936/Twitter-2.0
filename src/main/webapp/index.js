
let destructor = null;

function callDestructor(newDestructor = null, toCall = true) {
    if (toCall)
        destructor?.();
    destructor = newDestructor;
}

function justDoIt(toPush = true) {

    const qp = getQueryKVMap(decodeURIComponent(window.location.search));



    window.scrollTo({top: 0, behavior: 'smooth'});
    

    if (qp.size == 0 || qp.get('p') == 'home') {

        setHomePage(toPush, qp.size == 0);

    } else if (qp.get('p') == 'profile') {

        if (qp.get('id') == undefined) {
            // NO id mentioned
        } else {

            showUserProfile(toPush, +qp.get('id'), qp.get('pfi'));

        }

    } else if (qp.get('p') == 'explore') {

        showExploreSection(decodeURIComponent(window.location.search.substring(1)), toPush ? 'push' : 'replace');

    } else if (qp.get('p') == 'tweet') {

        showTopLayerTweet();

    } else if (qp.get('p') == 'tweet-info') {

        showTweet(qp.get('id'));

    } else if (qp.get('p') == 'quotes') {

        showQuotedTweets(qp.get('id'));

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

            console.log('popstate', window.location);

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

    window.scrollTo({top: 0, behavior: 'smooth'});

    if (isStart)
        window.history.replaceState(null, "Home", "?p=home");
    else if (toPush)
        window.history.pushState(null, "Home", "?p=home");

}

function showUserProfile(toPush = true, user_id = getCurrentUserIdInLS(), index) {

    $('#second-body').empty();
    $('#second-body').load('html/profile.html');

    $('html, body').animate({scrollTop: 0}, 100);

    if (toPush)
        window.history.pushState(null, "Profile", "?p=profile&id=" + user_id + (index != undefined ? "&pfi=" + index : ''));

}

function showExploreSection(searchQuery, to = 'push') {

    $('#second-body').empty();
    $('#second-body').load('html/explore.html');

    window.scrollTo({top: 0, behavior: 'smooth'});

    searchQuery = '?' + encodeURIComponent(searchQuery);

    if (to == 'push')
        window.history.pushState(null, "Explore", searchQuery);
    else if (to == 'replace')
        window.history.replaceState(null, "Explore", searchQuery);

}


var topLayerReplyTweetBox = null, topLayerRetweetBox = null;

function showTopLayerTweet(replyTweetBox = null, retweetBox = null) {

    $('#auxiliary-container').empty();
    $('#auxiliary-container').load('html/top-layer-tweet.html');

    topLayerReplyTweetBox = replyTweetBox;
    topLayerRetweetBox = retweetBox;

    if (replyTweetBox != null) {
        
        window.history.replaceState({ prevSearch: window.location.search }, "Top-Layer-Tweet", '?p=tweet&reply=' + replyTweetBox['tweet']['id']);

    } else if (retweetBox != null) {
        
        window.history.replaceState({ prevSearch: window.location.search }, "Top-Layer-Tweet", '?p=tweet&retweet=' + retweetBox['tweet']['id']);

    } else {

        window.history.replaceState({ prevSearch: window.location.search }, "Top-Layer-Tweet", '?p=tweet');

    }

}

function showTweet(id) {

    $('#second-body').empty();
    $('#second-body').load('html/tweet-info.html');

    window.scrollTo({top: 0, behavior: 'smooth'});

    window.history.pushState(null, "Top-Layer-Tweet", '?p=tweet-info&id=' + id);

}



// retweet && like
function showRLTweetInfoTopLayer(tweet_id, rl) {

    $('#auxiliary-container').empty();
    $('#auxiliary-container').load('html/tweet-info-rl.html');

    window.history.replaceState(null, "showRLTweetInfoTopLayer", '?p=tweet-info&id=' + tweet_id + "&rl=" + rl);

}



function showQuotedTweets(tweet_id) {

    $('#second-body').empty();
    $('#second-body').load('html/quote-tweet.html');

    window.history.pushState(null, "Quoted-Tweets", '?p=quotes&id=' + tweet_id);

}


function logout() {

}

