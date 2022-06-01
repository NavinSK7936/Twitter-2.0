function totalTweetsPara(tweet_count) {
    return tweet_count + ' Tweet' + (tweet_count == 1 ? '' : 's');
}


function showNoSearchResultsFound(showNothingFound = true) {
    showUI($('#top-app-bar-search-trending-bar'), false);
    showUI($('#top-app-bar-search-loading-div'), false);
    showUI($('#top-app-bar-search-nothing-found'), showNothingFound);
}

function hashtagClickedOnHashtagCell(event, hashtag) {
    // event.stopPropagation();
    console.log('hash cell clicked:', hashtag);

    let currStr = $('#top-app-bar-search-input-field').val();
    $('#top-app-bar-search-input-field').val((currStr.split(' ').slice(0, -1).join(' ') + ' ' + hashtag + ' ').trimStart());
    showUI($('#top-app-bar-search-dropdown'), false);

}

function userClickedOnUserCell(event, mention_name) {

    console.log('user cell clicked:', mention_name);

    let currStr = $('#top-app-bar-search-input-field').val();
    $('#top-app-bar-search-input-field').val((currStr.split(' ').slice(0, -1).join(' ') + ' ' + mention_name + ' ').trimStart());
    showUI($('#top-app-bar-search-dropdown'), false);

}

function getSearchHashCell(hashtag, tweet_count) {
    return `
        <div>
            <div onclick="hashtagClickedOnHashtagCell(event, '` + `#` + hashtag + `')" style="cursor: pointer; color: black; display: block; flex-direction: column; margin: 10px 0; margin-left: 30px;">
                <div style="font-size: 18px; font-weight: 700;" >#` + hashtag + `</div>
                <div style="font-size: 13px; font-weight: 600; margin-top: -5px;">` + totalTweetsPara(tweet_count) + `</div>
            </div>
            <hr style="margin: 0 15px;"></hr>
        </div>
    `;
}

function getSearchUserCell(user) {
    return `
        <div>
            <div onclick="userClickedOnUserCell(event, '@` + user['mention_name'] + `')" style="cursor: pointer; display: flex; margin: 10px 10px;">
                <div style="margin-right: 10px;">
                    <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/default_profile.png" alt="User Icon">
                </div>
                <div style="width: 100%;">
                    <div class="remove-link-underline tweet-tweeter-name">
                        <span>` + user['user_name'] + `</span>
                    </div>
                    <div style="margin-top: -8px; display: flex; align-items: center;">
                        <div class="remove-link-underline tweet-tweeter-id-name">
                            <span>@` + user['mention_name'] + `</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr style="margin: 0 15px;">
        </div>
    `;
}