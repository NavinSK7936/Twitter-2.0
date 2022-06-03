function totalTweetsPara(tweet_count) {
    return tweet_count + ' Tweet' + (tweet_count == 1 ? '' : 's');
}


function showNoSearchResultsFound(showNothingFound = true, showTrendingBar = false) {
    showUI($('#top-app-bar-search-trending-bar'), showTrendingBar);
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
    // <div>
    //     <div onclick="hashtagClickedOnHashtagCell(event, '` + `#` + hashtag + `')" style="cursor: pointer; color: black; display: block; flex-direction: column; margin: 10px 0; margin-left: 30px;">
    //         <div style="font-size: 18px; font-weight: 700;" >#` + hashtag + `</div>
    //         <div style="font-size: 13px; font-weight: 600; margin-top: -5px;">` + totalTweetsPara(tweet_count) + `</div>
    //     </div>
    //     <hr style="margin: 0 15px;"></hr>
    // </div>
    return `
        <div>
            <div onclick="hashtagClickedOnHashtagCell(event, '` + `#` + hashtag + `')" style="cursor: pointer; display: flex; margin: 6px 10px;">
                <div style="margin-right: 8px; padding-top: 0px; margin-left: 10px;">
                    <i class="ri-hashtag" style="font-size: 30px;"></i>
                </div>
                <div style="width: 100%; margin-top: -2px;">
                    <div class="remove-link-underline tweet-tweeter-name" role="link">
                        <span id="tweet-time" style="font-size: 16px;">` + hashtag + `</span>
                    </div>
                    <div style="margin-top: -8px; display: flex; align-items: center;">
                        <div class="remove-link-underline tweet-tweeter-id-name" role="link">
                            <span id="tweet-time" style="font-size: 13px;">` + totalTweetsPara(tweet_count) + `</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr style="margin: 0 15px;">
        </div>
    `;
}

function getSearchUserCell(user) {
    // <div>
    //     <div onclick="userClickedOnUserCell(event, '@` + user['mention_name'] + `')" style="cursor: pointer; display: flex; margin: 10px 10px;">
    //         <div style="margin-right: 10px;">
    //             <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/default_profile.png" alt="User Icon">
    //         </div>
    //         <div style="width: 100%;">
    //             <div class="remove-link-underline tweet-tweeter-name">
    //                 <span>` + user['user_name'] + `</span>
    //             </div>
    //             <div style="margin-top: -8px; display: flex; align-items: center;">
    //                 <div class="remove-link-underline tweet-tweeter-id-name">
    //                     <span>@` + user['mention_name'] + `</span>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    //     <hr style="margin: 0 15px;">
    // </div>
    return `
        <div>
            <div onclick="userClickedOnUserCell(event, '@` + user['mention_name'] + `')" style="cursor: pointer; display: flex; margin: 6px 10px;">
                <div style="margin-right: 8px; padding-top: 1px;">
                    <img style="width: 45px; height: 45px; border-radius: 50%;"
                        src="images/default_profile.png" alt="User Icon">
                </div>
                <div style="width: 100%; margin-top: -2px;">
                    <div class="remove-link-underline tweet-tweeter-name" role="link">
                        <span id="tweet-time" style="font-size: 16px;">` + user['user_name'] + `</span>
                    </div>
                    <div style="margin-top: -5px; display: flex; align-items: center;">
                        <div class="remove-link-underline tweet-tweeter-id-name"
                            role="link">
                            <span id="tweet-time" style="font-size: 16px;">@` + user['mention_name'] + `</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr style="margin: 0 15px;">
        </div>
    `;
}