// $(function() {

    console.log("PROFILE");

    {
        const queries = document.location.search.substring(1).split('&');

        queries.forEach(e => console.log(e));

    }


    // window.onpopstate = function(event) {
    //     console.log('FROM profile.js', "location: " + document.location + ", state: " + JSON.stringify(event.state));
    // };

        // window.history.pushState("state-profile.html", "Profile Title", "profile.html");

// })