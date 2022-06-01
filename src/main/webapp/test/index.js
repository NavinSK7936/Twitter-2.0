$(function() {

    console.log('HOME');

    // window.history.pushState("state-home.html", "Home", "../../");

    window.onpopstate = function(event) {

        console.log('popped', document.location);

        // const arr = document.location.pathname.split('/');
        // const file = arr[arr.length-1];

        // $('#second-body').load(file);

    };

    $('#first-home-button-id').click(function() {

        $('#second-body').empty();

        $('#second-body').load('home.html');

        window.history.pushState("state-home.html", "Home", "home");

    })

    $('#first-profile-button-id').click(function() {

        $('#second-body').empty();

        $('#second-body').load('profile.html');

        window.history.pushState("state-profile.html", "Profile Title", "profile");

    })

    $('#first-tweet-button-id').click(function() {

        window.history.pushState("state-profile.html", "Profile Title", "profile?q=90&g=78");
        
        console.log(document.location);

    })

    $('#first-home-button-id').click();

})