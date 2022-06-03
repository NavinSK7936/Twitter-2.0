

$(function() {

    initTopLayer();

    $('#top-layer-tweet').click(closeTopLayerTweet);
    $('#top-layer-tweet-close').click(closeTopLayerTweet);

})

function initTopLayer() {
    
    $('#top-layer-tweet-who-can-reply-div').click(function(event) {

        event.stopPropagation();

        if ($('#top-layer-tweet-who-can-reply-dropdown-menu').is(":hidden"))
            $('#top-layer-tweet-who-can-reply').dropdown('toggle');

    })

    $('#top-layer-tweet-container').click((event) => {
        
        event.stopPropagation();

        if (!$('#top-layer-tweet-who-can-reply-dropdown-menu').is(":hidden"))
            $('#top-layer-tweet-who-can-reply').dropdown('toggle');

    })

    const whoCanReplyStrings = ['Everyone', 'People you follow', 'Only People you mention'];
    const whoCanReplyIcons = ['ri-earth-fill', 'fa fa-user', 'ri-at-line'];

    $('.top-layer-tweet-who-can-reply-choice').click(function(event) {

        event.stopPropagation();
        $('#top-layer-tweet-who-can-reply').dropdown('toggle');

        const index = $(this).data('who-can-reply-choice');

        console.log(whoCanReplyIcons[index]);

        $('#top-layer-tweet-who-can-reply-main-icon').removeClass();
        $('#top-layer-tweet-who-can-reply-main-icon').addClass(whoCanReplyIcons[index]);

        $('#top-layer-tweet-who-can-reply-string').text(whoCanReplyStrings[index] + ' can reply');
        $('#top-layer-tweet-who-can-reply').data('-who-can-reply-choice', index);

        console.log($('#top-layer-tweet-who-can-reply').data('-who-can-reply-choice'));
        // top-layer-tweet-who-can-reply-choice

    })
                
    const tweetMaxChars = 280;

    $('#top-layer-tweet-input-field').empty();

    $('#top-layer-tweet-input-field').on('focusout', function() {
        console.log('out-io', $('#top-layer-tweet-input-field').text().length, '|' + $('#top-layer-tweet-input-field').text() + '|');
        if ($(this).text().length == 0) {
            showUI($(this), false);
            showUI($('#top-layer-tweet-input-placeholder'));
        }
    })

    $('#top-layer-tweet-input-placeholder').on('click', function(event) {
        showUI($(this), false);
        showUI($('#top-layer-tweet-input-field'));
        $('#top-layer-tweet-input-field').focus();
    })

    $('#top-layer-tweet-input-field').on('input keydown paste', function(event) {

        let len = Math.min(Math.floor(($(this).text().length * 85) / tweetMaxChars), 85);

        console.log(len, $(this).text().length);

        showUI($('#top-layer-tweet-count-loader'));

        if ($(this).text().trim().length == 0) {
            if (!$('#top-layer-tweet-button').hasClass('top-layer-tweet-button-zero-text'))
                $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');
            showUI($('#top-layer-tweet-count-loader'), false);
        } else {
            $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');
        }

        if($(this).text().trim().length >= tweetMaxChars && event.keyCode != 8) {
            event.preventDefault();

            $(this).text($(this).text().substring(0, tweetMaxChars));
        }
        
        $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke-dashoffset', 85 - len);
    });
}


// function initTopLayer() {

//     const whoCanReplyStrings = ['Everyone', 'People you follow', 'Only People you mention'];
//     const whoCanReplyIcons = ['ri-earth-fill', 'fa fa-user', 'ri-at-line'];

//     $('.top-layer-tweet-who-can-reply-choice').click(function(event) {

//         const index = $(this).data('who-can-reply-choice');

//         console.log(whoCanReplyIcons[index]);

//         $('#top-layer-tweet-who-can-reply-main-icon').removeClass();
//         $('#top-layer-tweet-who-can-reply-main-icon').addClass(whoCanReplyIcons[index]);

//         $('#top-layer-tweet-who-can-reply-string').text(whoCanReplyStrings[index] + ' can reply');
//         $('#top-layer-tweet-who-can-reply').data('-who-can-reply-choice', index);

//         console.log($('#top-layer-tweet-who-can-reply').data('-who-can-reply-choice'));
//         // top-layer-tweet-who-can-reply-choice

//     })
 
//     const tweetMaxChars = 280;

//     $('#top-layer-tweet-input-field').empty();

//     $('#top-layer-tweet-input-field').on('focusout', function() {
//         console.log('out-io', $('#top-layer-tweet-input-field').text().length, '|' + $('#top-layer-tweet-input-field').text() + '|');
//         if ($(this).text().length == 0) {
//             showUI($(this), false);
//             showUI($('#top-layer-tweet-input-placeholder'));
//         }
//     })

//     $('#top-layer-tweet-input-placeholder').on('click', function(event) {
//         showUI($(this), false);
//         showUI($('#top-layer-tweet-input-field'));
//         $('#top-layer-tweet-input-field').focus();
//     })

//     $('#top-layer-tweet-input-field').on('input keydown paste', function(event) {

//         let len = Math.min(Math.floor(($(this).text().length * 85) / tweetMaxChars), 85);

//         showUI($('#top-layer-tweet-count-loader'));

//         if ($(this).text().trim().length == 0) {
//             if (!$('#top-layer-tweet-button').hasClass('top-layer-tweet-button-zero-text') && $('#top-layer-tweet-container').data('tweet-type') != 'retweet')
//                 $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');
//             showUI($('#top-layer-tweet-count-loader'), false);
//         } else {
//             $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');
//         }

//         if($(this).text().trim().length >= tweetMaxChars && event.keyCode != 8) {
//             event.preventDefault();

//             $(this).text($(this).text().substring(0, tweetMaxChars));
//         }
        
//         $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke-dashoffset', 85 - len);
//     });

// }



// function initTopLayer() {

//     const whoCanReplyStrings = ['Everyone', 'People you follow', 'Only People you mention'];
//     $('#top-layer-tweet-who-can-reply').click(function() {

//         var whoCanReplyIndex = +$('#top-layer-tweet-who-can-reply').data('who-can-reply-index');
//         showUI($('#top-layer-tweet-who-can-reply-icons-' + whoCanReplyIndex), false);

//         whoCanReplyIndex = (whoCanReplyIndex + 1) % 3;
//         $('#top-layer-tweet-who-can-reply').data('who-can-reply-index', '' + whoCanReplyIndex);

//         $('#top-layer-tweet-who-can-reply-text').text(whoCanReplyStrings[whoCanReplyIndex])

//         showUI($('#top-layer-tweet-who-can-reply-icons-' + whoCanReplyIndex));

//     })
                
//     const tweetMaxChars = 280;

//     $('#top-layer-tweet-input-field').empty();

//     $('#top-layer-tweet-input-field').on('focusout', function() {
//         console.log('out-io', $('#top-layer-tweet-input-field').text().length, '|' + $('#top-layer-tweet-input-field').text() + '|');
//         if ($(this).text().length == 0) {
//             showUI($(this), false);
//             showUI($('#top-layer-tweet-input-placeholder'));
//         }
//     })

//     $('#top-layer-tweet-input-placeholder').on('click', function(event) {
//         showUI($(this), false);
//         showUI($('#top-layer-tweet-input-field'));
//         $('#top-layer-tweet-input-field').focus();
//     })

//     $('#top-layer-tweet-input-field').on('input keydown paste', function(event) {

//         let len = Math.min(Math.floor(($(this).text().length * 85) / tweetMaxChars), 85);

//         showUI($('#top-layer-tweet-count-loader'));

//         if ($(this).text().trim().length == 0) {
//             if (!$('#top-layer-tweet-button').hasClass('top-layer-tweet-button-zero-text') && $('#top-layer-tweet-container').data('tweet-type') != 'retweet')
//                 $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');
//             showUI($('#top-layer-tweet-count-loader'), false);
//         } else {
//             $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');
//         }

//         if($(this).text().trim().length >= tweetMaxChars && event.keyCode != 8) {
//             event.preventDefault();

//             $(this).text($(this).text().substring(0, tweetMaxChars));
//         }
        
//         $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke-dashoffset', 85 - len);
//     });

// }

function closeTopLayerTweet() {

    $('#top-layer-tweet').css('visibility', 'hidden');

}


function setTopTweetLayer(replyTweetBox, retweetTweetBox) {

    $('#top-layer-tweet').css('visibility', 'visible');

    showUI($('#top-layer-tweet-reply'), false);
    showUI($('#top-layer-tweet-retweet'), false);
    showUI($('#top-layer-tweet-who-can-reply-div'));
    showUI($('#top-layer-tweet-input-placeholder'));
    showUI($('#top-layer-tweet-count-loader'), false);
    showUI($('#top-layer-tweet-input-field'), false);
    $('#top-layer-tweet-input-field').empty();
    $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');

    $('.top-layer-tweet-who-can-reply-choice[data-who-can-reply-choice="0"]').click();


    if (replyTweetBox != undefined) {

        showUI($('#top-layer-tweet-reply'));
        showUI($('#top-layer-tweet-who-can-reply-div'), false);

        $('#top-layer-tweet-container').data('tweet-type', 'reply');
        $('#top-layer-tweet-input-placeholder').text('Tweet your reply');

        $('.top-layer-tweet-reply-username').text(replyTweetBox['user']['user_name']);
        $('.top-layer-tweet-reply-mention').text(replyTweetBox['user']['mention_name']);
        $('.top-layer-tweet-reply-tweet-timespan').text(getTimeSpanFromNow(replyTweetBox['tweet']['created_at']));
        $('.top-layer-tweet-reply-tweet-quote').html(getResultWithHashtags(replyTweetBox['tweet']['quote']));

    } else if (retweetTweetBox != undefined) {

        showUI($('#top-layer-tweet-retweet'));

        $('#top-layer-tweet-container').data('tweet-type', 'retweet');
        $('#top-layer-tweet-input-placeholder').text('Add a comment');

        $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');

        $('.top-layer-tweet-retweet-username').text(retweetTweetBox['user']['user_name']);
        $('.top-layer-tweet-retweet-mention').text(retweetTweetBox['user']['mention_name']);
        $('.top-layer-tweet-retweet-tweet-timespan').text(getTimeSpanFromNow(retweetTweetBox['tweet']['created_at']));
        $('.top-layer-tweet-retweet-tweet-quote').html(getResultWithHashtags(retweetTweetBox['tweet']['quote']));

    } else {
        
        $('#top-layer-tweet-container').data('tweet-type', 'tweet');
        $('#top-layer-tweet-input-placeholder').text('What\'s happening?');


    }
}


// $(function() {

//     initTopLayer();

//     $('#top-layer-tweet').click(closeTopLayerTweet);
//     $('#top-layer-tweet-close').click(closeTopLayerTweet);

// })

// function initTopLayer() {

//     const whoCanReplyStrings = ['Everyone', 'People you follow', 'Only People you mention'];
//     $('#top-layer-tweet-who-can-reply').click(function() {

//         var whoCanReplyIndex = +$('#top-layer-tweet-who-can-reply').data('who-can-reply-index');
//         showUI($('#top-layer-tweet-who-can-reply-icons-' + whoCanReplyIndex), false);

//         whoCanReplyIndex = (whoCanReplyIndex + 1) % 3;
//         $('#top-layer-tweet-who-can-reply').data('who-can-reply-index', '' + whoCanReplyIndex);

//         $('#top-layer-tweet-who-can-reply-text').text(whoCanReplyStrings[whoCanReplyIndex])

//         showUI($('#top-layer-tweet-who-can-reply-icons-' + whoCanReplyIndex));

//     })
                
//     const tweetMaxChars = 280;

//     $('#top-layer-tweet-input-field').empty();

//     $('#top-layer-tweet-input-field').on('focusout', function() {
//         console.log('out-io', $('#top-layer-tweet-input-field').text().length, '|' + $('#top-layer-tweet-input-field').text() + '|');
//         if ($(this).text().length == 0) {
//             showUI($(this), false);
//             showUI($('#top-layer-tweet-input-placeholder'));
//         }
//     })

//     $('#top-layer-tweet-input-placeholder').on('click', function(event) {
//         showUI($(this), false);
//         showUI($('#top-layer-tweet-input-field'));
//         $('#top-layer-tweet-input-field').focus();
//     })

//     $('#top-layer-tweet-input-field').on('input keydown paste', function(event) {

//         let len = Math.min(Math.floor(($(this).text().length * 85) / tweetMaxChars), 85);

//         showUI($('#top-layer-tweet-count-loader'));

//         if ($(this).text().trim().length == 0) {
//             if (!$('#top-layer-tweet-button').hasClass('top-layer-tweet-button-zero-text') && $('#top-layer-tweet-container').data('tweet-type') != 'retweet')
//                 $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');
//             showUI($('#top-layer-tweet-count-loader'), false);
//         } else {
//             $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');
//         }

//         if($(this).text().trim().length >= tweetMaxChars && event.keyCode != 8) {
//             event.preventDefault();

//             $(this).text($(this).text().substring(0, tweetMaxChars));
//         }
        
//         $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke-dashoffset', 85 - len);
//     });

// }

// function closeTopLayerTweet() {

//     $('#top-layer-tweet').css('visibility', 'hidden');

// }


// function setTopTweetLayer(replyTweetBox, retweetTweetBox) {

//     $('#top-layer-tweet').css('visibility', 'visible');

//     showUI($('#top-layer-tweet-reply'), false);
//     showUI($('#top-layer-tweet-retweet'), false);
//     showUI($('#top-layer-tweet-who-can-reply-div'));
//     $('#top-layer-tweet-input-field').empty();
//     $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');


//     if (replyTweetBox != undefined) {

//         showUI($('#top-layer-tweet-reply'));
//         showUI($('#top-layer-tweet-who-can-reply-div'), false);

//         $('#top-layer-tweet-container').data('tweet-type', 'reply');
//         $('#top-layer-tweet-input-placeholder').text('Tweet your reply');

//         $('.top-layer-tweet-reply-username').text(replyTweetBox['user']['user_name']);
//         $('.top-layer-tweet-reply-mention').text(replyTweetBox['user']['mention_name']);
//         $('.top-layer-tweet-reply-tweet-timespan').text(getTimeSpanFromNow(replyTweetBox['tweet']['created_at']));
//         $('.top-layer-tweet-reply-tweet-quote').html(getResultWithHashtags(replyTweetBox['tweet']['quote']));

//     } else if (retweetTweetBox != undefined) {

//         showUI($('#top-layer-tweet-retweet'));

//         $('#top-layer-tweet-container').data('tweet-type', 'retweet');
//         $('#top-layer-tweet-input-placeholder').text('Add a comment');

//         $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');

//         $('.top-layer-tweet-retweet-username').text(retweetTweetBox['user']['user_name']);
//         $('.top-layer-tweet-retweet-mention').text(retweetTweetBox['user']['mention_name']);
//         $('.top-layer-tweet-retweet-tweet-timespan').text(getTimeSpanFromNow(retweetTweetBox['tweet']['created_at']));
//         $('.top-layer-tweet-retweet-tweet-quote').html(getResultWithHashtags(retweetTweetBox['tweet']['quote']));

//     } else {
        
//         $('#top-layer-tweet-container').data('tweet-type', 'tweet');
//         $('#top-layer-tweet-input-placeholder').text('What\'s happening?');


//     }
// }

