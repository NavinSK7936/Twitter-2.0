if (performance.getEntriesByType("navigation")[0].type == "reload") {
    
    // $('#second-body').empty();

    window.location.href = 'index.html';

    // load('index.html');

    window.history.pushState("state-profile.html", "Profile Title", "index.html");

}

// window.addEventListener('load', (event) => {
//     console.log('page is fully loaded', event);
// });

// $(window).on('load', function () {
//     alert("Window Loaded");
// });