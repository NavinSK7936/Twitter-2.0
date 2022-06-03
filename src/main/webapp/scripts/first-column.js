$(function() {

    $('#first-tweet-button-id').click(setTopTweetLayer);


    $.ajax({
        url: base_url + "user/id/" + getCurrentUserIdInLS(),
        type: "GET",
        contentType: "application/json; charSet=UTF-8",
        dataType: "json",
        timeout: 2500,
        success: function(user) {

            $('.current-user-name').text(user['user_name']);
            $('.current-mention-name').text(user['mention_name']);
            
            showUI($('#first-column-bottom-dock-spinner'), false);
            showUI($('#first-column-bottom-user-container'));

        }, error: function(request, status, error) {
            console.log('set-current-user-details in page:', request.responseText, status, error);
        }, complete: function() {
        }

    })

})