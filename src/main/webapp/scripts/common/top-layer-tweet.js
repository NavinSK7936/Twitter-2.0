

var inputTweetController;
var emptyTweetPieces = new Set();

$(function() {

    callDestructor(function() {
        $('#auxiliary-container').empty();
    }, false)

    initTopLayer();

    // setTopAppBar({ title: 'Home', showBackButton: false })

    setTopTweetLayer(topLayerReplyTweetBox, topLayerRetweetBox);

})


function validateBottomDockContents(len) {

    showUI($('#top-layer-tweet-add-next-tweet-div'));
    showUI($('#top-layer-tweet-count-loader'));

    if ($('#top-layer-tweet-input-field').text().length == 0) {
        
        emptyTweetPieces.add(inputTweetController.curr_id);

        if (emptyTweetPieces.size)
            $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');
        
        showUI($('#top-layer-tweet-add-next-tweet-div'), false);
        showUI($('#top-layer-tweet-count-loader'), false);

    } else {
        
        emptyTweetPieces.delete(inputTweetController.curr_id);

        if (emptyTweetPieces.size == 0)
            $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');
        
    }



    if ($('#top-layer-next-tweet-container').data('total-pieces') > 1)
        $('#top-layer-tweet-button').text('Tweet All');
    else
        $('#top-layer-tweet-button').text('Tweet');


    
    if (tweetMaxChars - $('#top-layer-tweet-input-field').text().length <= 30) {
        
        $('#top-layer-tweet-text-count-field').text(tweetMaxChars - $('#top-layer-tweet-input-field').text().length);

        if (tweetMaxChars - $('#top-layer-tweet-input-field').text().length <= 10) {
            $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke', 'red');
        } else {
            $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke', 'orange');
        }

    } else {

        $('#top-layer-tweet-text-count-field').empty();
        $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke', 'rgb(12, 114, 200)');

    }

    $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke-dashoffset', 85 - len);

}


function getDiffIndex(s1, s2) {

    var i = 0;

    s1 = s1.replace(/\s/g, "_").replace(/_/g, ' ');
    s2 = s2.replace(/\s/g, "_").replace(/_/g, ' ');

    while (s1[i] == s2[i] && i < s1.length && i < s2.length) {
        // console.log(s1[i] == ' ');
        i++;
    }

    return i;
}


function getThatWord(s, index) {

    var lindex = index, rindex = index;

    s = s.replace(/\s/g, "_");

    while (s[lindex] != '_' && ~lindex)
        lindex--;
    
    while (s[rindex] != '_' && rindex < s.length)
        rindex++;

    return s.substring(lindex+1, rindex).replace(/_/g, ' ');

}

// Get index of '@' when the index of the word changed is given
function getIndexWhereWordsDiff(s, index) {

    var lindex = index, rindex = index;

    s = s.replace(/\s/g, "_");

    while (s[lindex] != '_' && ~lindex)
        lindex--;
    
    while (s[rindex] != '_' && rindex < s.length)
        rindex++;
    
    return {
        left: s.substring(0, lindex).replace(/_/g, ' '),
        right: s.substring(rindex).replace(/_/g, ' ')
    }

}


function setCursor(tag, pos) {
      
    // Creates range object
    var setpos = document.createRange();

    // Creates object for selection
    var set = window.getSelection();
      

    // Set start position of range
    setpos.setStart(tag.childNodes[0], pos);
      
    // Collapse range within its boundary points
    // Returns boolean
    setpos.collapse(true);
      
    // Remove all ranges set
    set.removeAllRanges();
      
    // Add range with respect to range object.
    set.addRange(setpos);
      
    // Set cursor on focus
    tag.focus();
}


function setCursorToLast(tag) {
    setCursor(tag, tag.innerHTML.length);
}


// Working perfectly, use jquery object
function getCaretPosition(editableDiv) {
    editableDiv = editableDiv[0];

    var caretPos = 0, sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode == editableDiv) {
          caretPos = range.endOffset;
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      if (range.parentElement() == editableDiv) {
        var tempEl = document.createElement("span");
        editableDiv.insertBefore(tempEl, editableDiv.firstChild);
        var tempRange = range.duplicate();
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint("EndToEnd", range);
        caretPos = tempRange.text.length;
      }
    }
    return caretPos;
}


function closeTopLayerTweet() {

    // $('#top-layer-tweet').css('visibility', 'hidden');

    $('#auxiliary-container').empty();

    window.history.replaceState(null, "Back-From-Top-Layer-Tweet", window.history.state.prevSearch);

}



var mhSuggestionObserver = null;

var prevCaretPos;
var thatText, thatHtml, prevThatText;
var prevText = '', currText;
var prevHtml = '', currHtml;
var suggestionPageNo, suggestionPageSize = 5;

function initTopLayer() {




    mhSuggestionObserver?.disconnect();

    mhSuggestionObserver = respondToVisibility(document.getElementById('top-layer-tweet-suggestions-visiblity-block'), visible => {
        
        console.log(visible);

        if (!visible)
            return;
        
        showUI($('#top-layer-tweet-suggestions-slider'));
        showUI($('#top-layer-tweet-suggestions-visiblity-block'));

        showTweetSuggestions();
        
    })




    $('#top-layer-tweet-close').on('click', function() {
        closeTopLayerTweet()
    });


    $('#top-layer-tweet-button').on('click', function(event) {

        const tweets = [];

        $(`#top-layer-tweet-input-field-onblur-placholder-${inputTweetController.curr_id}`).html($('#top-layer-tweet-input-field').html());

        for (const item of inputTweetController.items) {

            var text = $(`#top-layer-tweet-input-field-onblur-placholder-${item}`).text().replace(/\s+/g, " ");
            var html = $(`#top-layer-tweet-input-field-onblur-placholder-${item}`).html().replace(/&nbsp;/g, " ");
            var i = 0, j = 0, result = '';

            for (; i < text.length; html = html.substring(j), j = 0) {

                if (text[i] == html[j]) {
                    result += text[i];
                    i++; j++;
                } else if (text[i] == '@' && html[j] == '<') {
                    
                    j = html.indexOf('data-id="') + 9, num = 0;

                    while (html[j] != '"')
                        num = num * 10 + +html[j++];
                    result += '${{' + num + '}}';

                    while (text[++i] != ' ');
                    
                    j = html.indexOf('</span>') + 7;

                } else if (text[i] == '#' && html[j] == '<') {
                    
                    while (result += text[i], text[++i] != ' ');

                    j = html.indexOf('</span>') + 7;
                }
            }

            tweets.push(result);

        }

        const whoCanReply = $('#top-layer-tweet-who-can-reply').attr('data-who-can-reply-choice');
        const qp = getQueryKVMap(decodeURIComponent(window.location.search));


        if (qp.get('retweet') != undefined) {

        } else if (qp.get('reply') != undefined) {

            $.ajax({
                url: base_url + "tweet/reply?parent_tweet_id=" + qp.get('reply'),
                type: "POST",
                contentType: "application/json; charSet=UTF-8",
                dataType: "json",
                data: JSON.stringify({
                    'user_id': getCurrentUserIdInLS(),
                    'quote': tweets[0],
                    'source_label': 1,
                    'who_can_reply': whoCanReply
                }),
                timeout: 2500,
                success: function(result) {
        
                    console.log('users-related', result);
        
                }, error: function(request, status, error) {
                    console.log('reply-tweet', request.responseText, status, error);
                }, complete: function() {
                }
            })

        } else {

        }

        console.log(whoCanReply, tweets);

    })





    inputTweetController = {
        curr_id: 0, // currently active field, 0 for parent
        items: new Set([0]),
        last_id: 0,
        total_propagtions: 0, // total count of propagation (inc. cancelled ones)
    };


    var opacityOnBlur = '.5';

    function repeat(next_id, add_new) {

        var tltif = $('#top-layer-tweet-input-field');
        var tltsd = $('#top-layer-tweet-suggested-div');
        var tltbd = $('#top-layer-tweet-bottom-dock');


        $(`#top-layer-tweet-input-field-onblur-placholder-${inputTweetController.curr_id}`).show();
        $(`#top-layer-tweet-input-field-close-${inputTweetController.curr_id}`).hide();
        $(`#top-layer-tweet-piece-${inputTweetController.curr_id}`).css('opacity', opacityOnBlur);
        $(`#top-layer-tweet-input-field-onblur-placholder-${inputTweetController.curr_id}`).html(tltif.html());

        tltif.empty();

        $('#top-layer-tweet-input-field').detach();
        $('#top-layer-tweet-suggested-div').detach();
        $('#top-layer-tweet-bottom-dock').detach();


        if (add_new) {
            
            inputTweetController.items.add(next_id);
            $(`#top-layer-tweet-piece-${inputTweetController.curr_id}`).after(getNextTweetPiece(next_id));

            if (inputTweetController.last_id == inputTweetController.curr_id) {
    
                inputTweetController.last_id = next_id;
                $(`#top-layer-next-util-item-container-${inputTweetController.curr_id}`).parent().addClass('tweet-reply-vertical-bar');

            } else {

                $(`#top-layer-next-util-item-container-${next_id}`).parent().addClass('tweet-reply-vertical-bar');

            }
            
        }


        $(`#top-layer-tweet-input-field-onblur-placholder-${next_id}`).hide();
        $(`#top-layer-tweet-input-field-close-${next_id}`).show();

        
        ($(`#top-layer-next-util-item-container-${next_id}`).find($(`#top-layer-tweet-retweet`)).length == 1 ?
            $(`#top-layer-tweet-retweet`) :
            $(`#top-layer-tweet-input-field-onblur-placholder-${next_id}`)
        ).after(tltbd);
        $(`#top-layer-tweet-input-field-onblur-placholder-${next_id}`).after(tltsd);
        $(`#top-layer-tweet-input-field-onblur-placholder-${next_id}`).after(tltif);


        $(`#top-layer-tweet-piece-${next_id}`).css('opacity', 1);

        if (!add_new) {
            tltif.html($(`#top-layer-tweet-input-field-onblur-placholder-${next_id}`).html());
        }

        tltif.focus();

        inputTweetController.curr_id = next_id;
        validateBottomDockContents(Math.min(Math.floor((tltif.text().length * 85) / tweetMaxChars), 85));

    }





    $(`#top-layer-tweet-piece-0`).on('click', function(event) {

        if ($(this).css('opacity') == 1)
            return;

        repeat($(this).data('container-id'), false);

    });


    $('#top-layer-tweet-add-next-tweet-button').click((event) => {

        event.stopPropagation();

        $('#top-layer-next-tweet-container').data('total-pieces', $('#top-layer-next-tweet-container').data('total-pieces')+1);

        var next_id = ++inputTweetController.total_propagtions;
        repeat(next_id, true);


        $(`#top-layer-tweet-piece-${next_id}`).on('click', function(event) {

            if ($(this).css('opacity') == 1)
                return;

            repeat($(this).data('container-id'), false);

        });

        $(`#top-layer-tweet-input-field-close-${next_id}`).on('click', function(event) {

            emptyTweetPieces.delete(next_id);
            inputTweetController.items.delete(next_id);
            $('#top-layer-next-tweet-container').data('total-pieces', $('#top-layer-next-tweet-container').data('total-pieces')-1);

            var parent_field = $(`#top-layer-tweet-piece-${next_id}`).prev();

            if (inputTweetController.last_id == next_id) {

                inputTweetController.last_id = parent_field.data('container-id');
                $(`#top-layer-next-util-item-container-${parent_field.data('container-id')}`).parent().removeClass('tweet-reply-vertical-bar');

            }

            parent_field.click();

            $(`#top-layer-tweet-piece-${next_id}`).remove();

        })

    })






    





    

    $('.top-layer-tweet-who-can-reply-choice').click(function(event) {

        const index = $(this).data('who-can-reply-choice');

        $('#top-layer-tweet-who-can-reply-main-icon').removeClass();
        $('#top-layer-tweet-who-can-reply-main-icon').addClass(whoCanReplyIcons[index]);

        $('#top-layer-tweet-who-can-reply-string').text(whoCanReplyStrings[index] + ' can reply');
        $('#top-layer-tweet-who-can-reply').attr('data-who-can-reply-choice', index);

    });

    $('#top-layer-tweet-input-field').empty();
    // $('#top-layer-tweet-input-field').focus();
    
    $('#top-layer-tweet-input-field').on('input paste keypress', function(event) { // Might add 'keypress' event too

        let len = Math.min(Math.floor(($(this).text().length * 85) / tweetMaxChars), 85);
        
        currText = $('#top-layer-tweet-input-field').text(), word = currText.split(' ').at(-1), char = word.at(-1);
        currHtml = $('#top-layer-tweet-input-field').html().replace(/&nbsp;/g, ' ');



        validateBottomDockContents(len);

        if (event.type == 'paste') {

            var pastedData = (event.clipboardData || event.originalEvent.clipboardData || window.clipboardData).getData('text');

            console.log(($(this).text() + pastedData).length);

            if(($(this).text() + pastedData).length >= tweetMaxChars) {
                
                $(this).html($(this).html() + pastedData.substr(0, tweetMaxChars - $(this).text().length));

                var text = $('#top-layer-tweet-input-field').html();

                validateBottomDockContents(85);

                $(this).empty();
                document.execCommand('insertHtml', true, text);

                event.preventDefault();
    
                return false;
            }

        }
        


        if (event.type == 'keypress') {

            var char = String.fromCharCode((window.event) ? event.which : event.keyCode)

            if (((window.event) ? event.which : event.keyCode) == 13)
                return false;

            else if($(this).text().trim().length >= tweetMaxChars && event.keyCode != 8) {
                
                event.preventDefault();
    
                return false;
            }

            else if (char == ' ' && thatText[0] == '#') {

                thatClick(thatText);

                return false
            }

            prevCaretPos = getCaretPosition($('#top-layer-tweet-input-field'));


            return true;

        }

        thatText = getThatWord(currText, getDiffIndex(prevText, currText));
        thatHtml = getThatWord(currText, getDiffIndex(prevText, currText));

        // CHECK FOR THAT unicode space
        if (thatText.charCodeAt(0) == 8205)
            thatText = thatText.substring(1);
        

        if (thatText[0] == '@' && thatText.length > 1) {

            prevCaretPos = getDiffIndex(prevHtml, currHtml);

            if ($('#top-layer-tweet-suggested-dropdown-menu').is(":hidden")) {
            
                $('#top-layer-tweet-suggested').dropdown('toggle');

            }

            suggestionPageNo = 0;

            $('.top-layer-tweet-suggestion-item').remove();

            showUI($('#top-layer-tweet-suggestions-visiblity-block'));
            showUI($('#top-layer-tweet-suggestions-slider'));

        } else if (thatText[0] == '#' && thatText.length > 1) {

            prevCaretPos = getDiffIndex(prevHtml, currHtml);

            if ($('#top-layer-tweet-suggested-dropdown-menu').is(":hidden")) {
             
                $('#top-layer-tweet-suggested').dropdown('toggle');

            }

            suggestionPageNo = 0;

            $('.top-layer-tweet-suggestion-item').remove();

            showUI($('#top-layer-tweet-suggestions-visiblity-block'));
            showUI($('#top-layer-tweet-suggestions-slider'));

        } else {

            if ($('#top-layer-tweet-suggested-dropdown-menu').is(":hidden") == false) {
             
                $('#top-layer-tweet-suggested').dropdown('toggle');

            }

        }

        // console.log(`|${prevText}|`, `|${currText}|`, getDiffIndex(prevText, currText), `|${thatText}|`);
        // console.log(`|${prevHtml}|`, `|${currHtml}|`, getDiffIndex(prevHtml, currHtml), `|${thatHtml}|`);

        prevText = currText;
        prevHtml = currHtml;
        prevThatText = thatText;

        return true;
        
    });

}


function thatClick(text, id = -1) {

    var {left, right} = getIndexWhereWordsDiff(prevHtml, prevCaretPos)

    console.log(`|${left}|`);
    console.log(`|${right}|`);

    $('#top-layer-tweet-input-field').empty();
    $('#top-layer-tweet-input-field').focus();

    document.execCommand('insertHtml', true, left)

    try {
        setCursor(
            $('#top-layer-tweet-input-field'),
            getDiffIndex(prevHtml, currHtml)
        );
    } catch (error) { 
    }

    document.execCommand('insertHtml', true, `<span> &#8205;</span>`)
    document.execCommand('insertHtml', true, `<span style="color: rgb(29, 155, 240);" ` + (~id ? `data-id="${id}"` : ``) + `>` + text + `</span>`) // DONT LEAVE TRAILING SPACE HERE, PUT IT BELOW if you need
    document.execCommand('insertHtml', true, `<span>` + (right.trim(' ').length != 0 ? '' : ' ') + `&#8205;</span>`)
    document.execCommand('insertHtml', true, right)

}


// var mentions = ['navinsk', 'sk', 'gk', 'sivam', 'krishna', 'kannan', 'vel', 'king', 'rish', 'vin', 'in', 's', 'i', 'io', 'kio', 'ss', 'noi'];
var hashtags = ['selena', 'beiber', 'ok', 'nights', 'kite', 'yoyo', 'ogam', 'gk', 'sivam', 'krishna', 'kannan', 'vel', 'jit'];

function showTweetSuggestions() {
    
    const word = thatText;

    if (word[0] == '@') {

        $.ajax({
            url: base_url + "user/rmentions?wildcard=" + word.substring(1) + "&user_id=" + getCurrentUserIdInLS() + "&start=" + suggestionPageNo + "&size=" + (suggestionPageSize+1),
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(mentions) {

                showUI($('#top-layer-tweet-suggestions-slider'), false);
                showUI($('#top-layer-tweet-suggestions-container-placeholder'), false);

                if (mentions == null || mentions.length == 0) {

                    showUI($('#top-layer-tweet-suggestions-container-placeholder'));

                    showUI($('#top-layer-tweet-suggestions-visiblity-block'), false);

                    return;
                }
            
                for (var i = 0; i < Math.min(suggestionPageSize, mentions.length); i++) {

                    if (suggestionPageNo + i)
                        $(`#top-layer-tweet-suggestions-container>li:nth-child(` + (suggestionPageNo + i) + `)`).after(getMentionCellInTweetSuggestion(mentions[i]['user_id'], mentions[i]['user_name'], mentions[i]['mention_name'], mentions[i]['is_following']));
                    else
                        $('#top-layer-tweet-suggestions-container').prepend(getMentionCellInTweetSuggestion(mentions[i]['user_id'], mentions[i]['user_name'], mentions[i]['mention_name'], mentions[i]['is_following']));

                }

                suggestionPageNo += suggestionPageSize;

                console.log('git', suggestionPageNo, mentions.length);

                if (mentions.length <= suggestionPageSize) {
                    showUI($('#top-layer-tweet-suggestions-visiblity-block'), false);
                }
    
            }, error: function(request, status, error) {
                console.log('user/rmentions', request.responseText, status, error);
            }, complete: function() {
            }
        })

    } else if (word[0] == '#') {

        console.log(`|${word}|`);

        $.ajax({
            url: base_url + "tweet/hashtags?wildcard=" + word.substring(1) + "&start=" + suggestionPageNo + "&size=" + (suggestionPageSize+1),
            type: "GET",
            contentType: "application/json; charSet=UTF-8",
            dataType: "json",
            timeout: 2500,
            success: function(hashtags) {

                showUI($('#top-layer-tweet-suggestions-slider'), false);
                showUI($('#top-layer-tweet-suggestions-container-placeholder'), false);

                hashtags = Object.keys(hashtags);

                console.log(hashtags);

                if (hashtags == null || hashtags.length == 0) {

                    showUI($('#top-layer-tweet-suggestions-container-placeholder'));

                    showUI($('#top-layer-tweet-suggestions-visiblity-block'), false);

                    return;
                }

                for (var i = 0; i < Math.min(suggestionPageSize, hashtags.length); i++) {
                    
                    if (suggestionPageNo + i)
                        $(`#top-layer-tweet-suggestions-container>li:nth-child(` + (suggestionPageNo + i) + `)`).after(getHashtagCellInTweetSuggestion(hashtags[i]));
                    else
                        $('#top-layer-tweet-suggestions-container').prepend(getHashtagCellInTweetSuggestion(hashtags[i]));

                }

                suggestionPageNo += suggestionPageSize;

                console.log('git', suggestionPageNo, hashtags.length);

                if (hashtags.length <= suggestionPageSize)
                    showUI($('#top-layer-tweet-suggestions-visiblity-block'), false);
    
            }, error: function(request, status, error) {
                console.log('tweet/hashtags', request.responseText, status, error);
            }, complete: function() {
            }
        })

    }

}



function setTopTweetLayer(replyTweetBox, retweetTweetBox) {

    // $('#top-layer-tweet-reply').remove();
    // $('#top-layer-tweet-retweet').remove();

    $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');
    $('.top-layer-tweet-who-can-reply-choice[data-who-can-reply-choice="0"]').click();


    if (replyTweetBox != undefined) {

        $('#top-layer-tweet-piece-0').prepend(getTopLayerReplyTweetPiece(replyTweetBox));
        $('#top-layer-tweet-container').data('tweet-type', 'reply');

        $('#top-layer-tweet-who-can-reply-div').remove();
        $('#top-layer-tweet-add-next-tweet-div').remove();

    } else if (retweetTweetBox != undefined) {

        $('#top-layer-tweet-suggested-div').after(getTopLayerRetweetPiece(retweetTweetBox));

        $('#top-layer-tweet-container').data('tweet-type', 'retweet');

    } else {
        
        $('#top-layer-tweet-container').data('tweet-type', 'tweet');

    }
}


// // $(function() {

// //     initTopLayer();

// //     $('#top-layer-tweet').click(closeTopLayerTweet);
// //     $('#top-layer-tweet-close').click(closeTopLayerTweet);

// // })

// // function initTopLayer() {

// //     const whoCanReplyStrings = ['Everyone', 'People you follow', 'Only People you mention'];
// //     $('#top-layer-tweet-who-can-reply').click(function() {

// //         var whoCanReplyIndex = +$('#top-layer-tweet-who-can-reply').data('who-can-reply-index');
// //         showUI($('#top-layer-tweet-who-can-reply-icons-' + whoCanReplyIndex), false);

// //         whoCanReplyIndex = (whoCanReplyIndex + 1) % 3;
// //         $('#top-layer-tweet-who-can-reply').data('who-can-reply-index', '' + whoCanReplyIndex);

// //         $('#top-layer-tweet-who-can-reply-text').text(whoCanReplyStrings[whoCanReplyIndex])

// //         showUI($('#top-layer-tweet-who-can-reply-icons-' + whoCanReplyIndex));

// //     })
                
// //     const tweetMaxChars = 280;

// //     $('#top-layer-tweet-input-field').empty();

// //     $('#top-layer-tweet-input-field').on('focusout', function() {
// //         console.log('out-io', $('#top-layer-tweet-input-field').text().length, '|' + $('#top-layer-tweet-input-field').text() + '|');
// //         if ($(this).text().length == 0) {
// //             showUI($(this), false);
// //             showUI($('#top-layer-tweet-input-placeholder'));
// //         }
// //     })

// //     $('#top-layer-tweet-input-placeholder').on('click', function(event) {
// //         showUI($(this), false);
// //         showUI($('#top-layer-tweet-input-field'));
// //         $('#top-layer-tweet-input-field').focus();
// //     })

// //     $('#top-layer-tweet-input-field').on('input keydown paste', function(event) {

// //         let len = Math.min(Math.floor(($(this).text().length * 85) / tweetMaxChars), 85);

// //         showUI($('#top-layer-tweet-count-loader'));

// //         if ($(this).text().trim().length == 0) {
// //             if (!$('#top-layer-tweet-button').hasClass('top-layer-tweet-button-zero-text') && $('#top-layer-tweet-container').data('tweet-type') != 'retweet')
// //                 $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');
// //             showUI($('#top-layer-tweet-count-loader'), false);
// //         } else {
// //             $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');
// //         }

// //         if($(this).text().trim().length >= tweetMaxChars && event.keyCode != 8) {
// //             event.preventDefault();

// //             $(this).text($(this).text().substring(0, tweetMaxChars));
// //         }
        
// //         $('#top-layer-tweet-count-loader-skill-circle-id').css('stroke-dashoffset', 85 - len);
// //     });

// // }

// // function closeTopLayerTweet() {

// //     $('#top-layer-tweet').css('visibility', 'hidden');

// // }


// // function setTopTweetLayer(replyTweetBox, retweetTweetBox) {

// //     $('#top-layer-tweet').css('visibility', 'visible');

// //     showUI($('#top-layer-tweet-reply'), false);
// //     showUI($('#top-layer-tweet-retweet'), false);
// //     showUI($('#top-layer-tweet-who-can-reply-div'));
// //     $('#top-layer-tweet-input-field').empty();
// //     $('#top-layer-tweet-button').addClass('top-layer-tweet-button-zero-text');


// //     if (replyTweetBox != undefined) {

// //         showUI($('#top-layer-tweet-reply'));
// //         showUI($('#top-layer-tweet-who-can-reply-div'), false);

// //         $('#top-layer-tweet-container').data('tweet-type', 'reply');
// //         $('#top-layer-tweet-input-placeholder').text('Tweet your reply');

// //         $('.top-layer-tweet-reply-username').text(replyTweetBox['user']['user_name']);
// //         $('.top-layer-tweet-reply-mention').text(replyTweetBox['user']['mention_name']);
// //         $('.top-layer-tweet-reply-tweet-timespan').text(getTimeSpanFromNow(replyTweetBox['tweet']['created_at']));
// //         $('.top-layer-tweet-reply-tweet-quote').html(getResultWithHashtags(replyTweetBox['tweet']['quote']));

// //     } else if (retweetTweetBox != undefined) {

// //         showUI($('#top-layer-tweet-retweet'));

// //         $('#top-layer-tweet-container').data('tweet-type', 'retweet');
// //         $('#top-layer-tweet-input-placeholder').text('Add a comment');

// //         $('#top-layer-tweet-button').removeClass('top-layer-tweet-button-zero-text');

// //         $('.top-layer-tweet-retweet-username').text(retweetTweetBox['user']['user_name']);
// //         $('.top-layer-tweet-retweet-mention').text(retweetTweetBox['user']['mention_name']);
// //         $('.top-layer-tweet-retweet-tweet-timespan').text(getTimeSpanFromNow(retweetTweetBox['tweet']['created_at']));
// //         $('.top-layer-tweet-retweet-tweet-quote').html(getResultWithHashtags(retweetTweetBox['tweet']['quote']));

// //     } else {
        
// //         $('#top-layer-tweet-container').data('tweet-type', 'tweet');
// //         $('#top-layer-tweet-input-placeholder').text('What\'s happening?');


// //     }
// // }

