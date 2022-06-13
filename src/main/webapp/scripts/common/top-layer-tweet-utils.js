function getNextTweetPiece(id) {
    return `
        <div id="top-layer-tweet-piece-${id}" data-container-id="${id}" class="top-layer-tweet-piece-class" style="opacity: 1; margin-top: 0px; min-height: 60px;">
        
            <!-- ACTUAL TWEET -->
            <div style="display: block; margin-bottom: 3px;">

                <div style="display: flex; margin-bottom: 3px;">
                    <div style="margin-right: 10px; background: white; padding-bottom: 3px;">
                        <div style="cursor: pointer;">
                            <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                        </div>
                    </div>
                </div>
                
                <div style="margin-left: 25px; margin-top: -40px; width: 100%; padding-right: 25px;">
                    
                    <div id="top-layer-next-util-item-container-${id}" style="padding-left:33px; position: relative;">

                        <div id="top-layer-tweet-input-field-close-${id}" style="display: block; position: absolute; right: 0; margin-top: -15px; cursor: pointer;">
                            <i class="ri-close-fill"></i>
                        </div>

                        <div id="top-layer-tweet-input-field-onblur-placholder-${id}" class="top-layer-tweet-placeholder" data-placeholder="Add a comment" style="display: none; width: 100%; font-size: 18px; font-weight: 550; margin-left: 5px;
                            cursor: text; word-break: break-word; padding-bottom: 5px;">
                            Add a comment
                        </div>

                    </div>
                </div>
            </div>

        </div>
    `
}


function getTopLayerReplyTweetPiece(replyTweetBox) {
    return `
        <div id="top-layer-tweet-reply" style="display: block; margin-bottom: 5px;">
            <div style="display: block; margin-bottom: -2px;">
                <div style="display: flex; margin-bottom: 3px;">
                    <div style="margin-right: 10px; background: white; padding-bottom: 3px;">
                        <div style="cursor: pointer;">
                            <img style="width: 50px; height: 50px; border-radius: 50%;" src="images/icon_doge.jpeg" alt="User Icon">
                        </div>
                    </div>
                    <div style="display: flex; margin-top: -20px; align-items: center; margin-bottom: 3px;">
                        <div style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" role="link">
                            <span>${replyTweetBox['user']['user_name']}</span>
                        </div>
                        <div style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" role="link">
                            <span>@</span><span>${replyTweetBox['user']['mention_name']}<span>
                        </div>
                        <span aria-hidden="true" style="margin: 0px 5px;">
                            <span>·</span>
                        </span>
                        <a class="remove-link-underline tweet-time-span" rel="noopener noreferrer" target="_blank" role="link">
                            <span>${getTimeSpanFromNow(replyTweetBox['tweet']['created_at'])}</span>
                        </a>
                    </div>
                </div>
                <div style="margin-left: 25px; margin-top: -20px; width: 100%; padding-right: 25px;">
                    
                    <div style="padding-left: 1px; border-left: 1.7px solid rgb(160, 160, 160); min-height: 40px;">
                        <div style="padding-left: 32px; margin-top: -25px;">
                            <div style="cursor: pointer; word-break: break-all; padding-bottom: 10px;">
                                ${getResultWithHashtags(replyTweetBox['tweet']['quote'])}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    `;
}

function getTopLayerRetweetPiece(retweetTweetBox) {
    return `
        <div id="top-layer-tweet-retweet" style="display: block; margin-top: 0px; margin-bottom: 0;">
            <div class="tweet-in-list">
                <div style="display: flex;">
                    <div style="width: 100%;">
                        <div class="tweet-in-list" style="border: 1px solid black; border-radius: 10px;">
                            <div style="cursor: pointer; display: flex;">
                                <div style="margin-right: 10px;">
                                    <img id="top-layer-tweet-retweet-icon" 
                                        style="width: 30px; height: 30px; border-radius: 50%;"
                                        src="images/icon_doge.jpeg" alt="User Icon">
                                </div>
                                <div style="width: 100%;">
                                    <div style="display: flex; align-items: center; margin-bottom: 3px;">
                                        <div style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" role="link">
                                            <span>${retweetTweetBox['user']['user_name']}</span>
                                        </div>
                                        <div style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" role="link">
                                            <span>@</span><span>${retweetTweetBox['user']['mention_name']}<span>
                                        </div>
                                        <span aria-hidden="true" style="margin: 0px 5px;">
                                            <span>·</span>
                                        </span>
                                        <a class="remove-link-underline tweet-time-span" rel="noopener noreferrer" target="_blank" role="link">
                                            <span>${getTimeSpanFromNow(retweetTweetBox['tweet']['created_at'])}</span>
                                        </a>
                                    </div>
    
                                    <p style="cursor: pointer; margin-bottom: 0;">
                                        ${getResultWithHashtags(retweetTweetBox['tweet']['quote'])}
                                    </p>
    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

}



function getMentionCellInTweetSuggestion(user_id, user_name, mention_name, isFollowing = false, img) {
    return `
        <li onclick="thatClick('@${mention_name}', ${user_id})" data-user-id="${user_id}" data-mention-name="@${mention_name}"
            style="display: block; position: relative;"
            class="top-layer-tweet-suggestions top-layer-tweet-suggestion-item">

            ` + (isFollowing ? `
                <div style="display: flex; margin-left: 30px; margin-bottom: -12px; padding-top: 5px;">
                    <div>
                        <i class="ri-user-fill"
                            style="color: rgb(113, 118, 123); position: relative; font-size: 15px; font-weight: 600;"></i>
                    </div>
                    <div style="color: rgb(113, 118, 123); font-size: 12px; font-weight: 550; margin-left: 15px;" class="center-text-vertically">
                        Following                                                
                    </div>
                </div>` : ``) + `
            
            
            <div style="display: flex; cursor: pointer;">
                <div style="border-radius: 9999px; margin: 10px 5px; margin-left: 10px;">
                    <img id="top-layer-tweet-suggestions-icons-0" height="40px" width="40px" style="border-radius: 50%;" src="images/icon_doge.jpeg">
                </div>
                <div style="display: block; margin: 10px 5px; margin-right: 10px;" class="dropdown-item center-text-vertically">
                    <div style="font-size: 15px; font-weight: 550;">
                        ` + user_name + `
                    </div>
                    <div style="font-size: 12px; font-weight: 450; color: rgb(110, 110, 110);">
                        @` + mention_name + `
                    </div>
                </div>
            </div>
        </li>
    `;
}

function getHashtagCellInTweetSuggestion(hashtag, extras = null) {
    return `
        <li onclick="thatClick('#${hashtag}')" data-hashtag="` + hashtag + `" style="display: block; position: relative;" class="top-layer-tweet-suggestions top-layer-tweet-suggestion-item">
            <div style="display: block; cursor: pointer; padding: 12px 15px;">
                <div style="font-size: 15px; font-weight: 600;">
                    #` + hashtag + `
                </div>
                ` +
                (extras != null ?
                    `<div style="display: block; font-size: 12px; font-weight: 500; color: rgb(150, 150, 150);">
                        1881 Tweets in last 1 hour
                    </div>` : ``)
                + `
            </div>
        </li>
    `;
}


// <!-- TOP LAYER -->
// <div id="top-layer-tweet" style="display: flex; visibility: hidden; position: fixed; background-color: rgba(63, 103, 138, 0.5); overflow: hidden; overflow-y: scroll;
//         top: 0; left: 0; width: 100%; height: 100%; z-index: 99; align-items: center; justify-content: center; ">

//     <div onclick="event.stopPropagation()" style="width: 40%; opacity: 1; background: rgb(255, 255, 255); border-radius: 20px;">
        
//         <div id="top-layer-tweet-container" style="padding: 10px;" data-tweet-type="tweet">
            
//             <div id="top-layer-tweet-close" style="margin: 0px 15px; margin-bottom: 5px;">
//                 <i class="ri-close-fill" style="cursor: pointer; font-size: 30px;"></i>
//             </div>

//             <!-- REPLY PARENT-DIV -->
//             <div id="top-layer-tweet-reply" style="display: block; margin-bottom: 20px;">
//                 <div class="">
//                     <div style="display: flex; margin-bottom: 0px;">
//                         <div style="margin-right: 10px;">
//                             <div style="margin-left: 5px;">
//                                 <img id="top-layer-tweet-reply-icon" style="width: 50px; height: 50px; border-radius: 50%;"
//                                     src="images/icon_doge.jpeg" alt="User Icon">
//                             </div>
//                             <div>
//                                 <div
//                                     style="height: 10px; border: 0.5px solid gray; width: 0; margin-left: 50%; margin-top: 2px;">
//                                 </div>
//                             </div>

//                         </div>
//                         <div style="width: 100%;">
                            
//                             <div style="display: flex; align-items: center; margin-bottom: 3px;">
//                                 <div class="remove-link-underline"
//                                     style="font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;">
//                                     <span class="top-layer-tweet-reply-username">Navin SK</span>
//                                 </div>
//                                 <div class="remove-link-underline"
//                                     style="font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#">
//                                     <span>@</span><span class="top-layer-tweet-reply-mention">NavinSK7936</span>
//                                 </div>
//                                 <span aria-hidden="true" style="margin: 0px 5px;">
//                                     <span>·</span>
//                                 </span>
//                                 <div class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank">
//                                     <span class="top-layer-tweet-reply-tweet-timespan">20h</span>
//                                 </div>
//                             </div>

//                             <div class="top-layer-tweet-reply-tweet-quote" style="margin-bottom: 8px; margin-right: 5px; font-size: 15px; font-weight: 520;">
//                                 First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL! First tweet LOL!
//                             </div>

//                             <div style="margin-top: 15px;">
//                                 <span style="font-size: 15px; font-weight: 500; color: rgb(110, 110, 110);">
//                                     Replying to
//                                 </span>
//                                 <span style="font-size: 14px; font-weight: 550; color: rgb(12, 114, 200);">
//                                     <span>@</span><span class="top-layer-tweet-reply-mention">NavinSK0000</span>
//                                 </span>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- TWEET-DIV -->
//             <div style="display: flex;">
//                 <div style="margin-right: 15px; margin-left: 5px;">
//                     <img style="cursor: pointer; width: 50px; height: 50px; border-radius: 50%;"
//                         src="images/icon_doge.jpeg" alt="User Icon">
//                 </div>
//                 <div style="width: 100%; margin-top: 5px;">
                    
//                     <div id="top-layer-tweet-input-field" contenteditable="true"
//                         style="display: none; width: 100%; font-size: 18px; font-weight: 550; margin-left: 5px; height: 100px; overflow-y: scroll; overflow-wrap: break-word;">
//                     </div>

//                     <div id="top-layer-tweet-input-placeholder" style="font-size: 20px; font-weight: 400; color: rgb(140, 110, 110); height: 100px;">
//                         Add a comment <!-- Tweet your reply-->
//                     </div>

//                     <!-- RETWEET -->
//                     <div id="top-layer-tweet-retweet" style="display: none; margin-bottom: -10px;">
//                         <div class="tweet-in-list">
//                             <div style="display: flex;">
//                                 <div style="width: 100%;">
//                                     <div class="tweet-in-list" style="border: 1px solid black; border-radius: 10px;">
//                                         <div style="cursor: pointer; display: flex;">
//                                             <div style="margin-right: 10px;">
//                                                 <img id="top-layer-tweet-retweet-icon" 
//                                                     style="width: 30px; height: 30px; border-radius: 50%;"
//                                                     src="images/icon_doge.jpeg" alt="User Icon">
//                                             </div>
//                                             <div style="width: 100%;">
//                                                 <div style="display: flex; align-items: center; margin-bottom: 3px;">
//                                                     <div style="cursor: pointer; font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
//                                                         <span class="top-layer-tweet-retweet-username">Navin SK</span>
//                                                     </div>
//                                                     <div style="cursor: pointer; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
//                                                         <span>@</span><span class="top-layer-tweet-retweet-mentionname">NavinSK7936<span>
//                                                     </div>
//                                                     <span aria-hidden="true" style="margin: 0px 5px;">
//                                                         <span>·</span>
//                                                     </span>
//                                                     <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
//                                                         <span class="top-layer-tweet-retweet-timespan">6h</span>
//                                                     </a>
//                                                 </div>
                
//                                                 <div class="top-layer-tweet-retweet-quote" style="margin-bottom: 8px; margin-right: 5px; font-size: 14px; font-weight: 520;">
//                                                     This is happening, just stop it!!!This is happening, just stop it!!!This is happening, just stop it!!!This is happening, just stop it!!!
//                                                 </div>
                
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Who can reply -DIV -->
//                     <div id="top-layer-tweet-who-can-reply-div" class="dropdown" style="margin-top: 10px;">
//                         <div id="top-layer-tweet-who-can-reply" class="dropdown-toggle" data-who-can-reply-choice="0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
//                             data-isclicked="isRetweeted" style="cursor: pointer; display: flex; color: rgb(29, 155, 240); display: inline-flex;">
//                             <!-- <i class="fa fa-retweet" style="font-size: 20px;"></i> -->
//                             <!-- <span id="count" style="margin-left: 10px; font-size: 14px; font-weight: 500;">12s5</span> -->
//                             <i id="top-layer-tweet-who-can-reply-main-icon" class="ri-earth-fill" style="color: rgb(29, 155, 240); position: relative;
//                                                 font-size: 18px; font-weight: 600;"></i>
//                             <div class="dropdown-item center-text-vertically"
//                                     style="margin-left: 5px; font-size: 15px; font-weight: 550;"
//                                     unselectable="on"
//                                     onselectstart="return false;"
//                                     onmousedown="return false;">
//                                 <div id="top-layer-tweet-who-can-reply-string">Everyone can reply</div>
//                             </div>
//                         </div>

//                         <ul id="top-layer-tweet-who-can-reply-dropdown-menu" class="dropdown-menu" aria-labelledby="dropdownMenuButton1"
//                             style="padding: 10px 0px; border: 1px solid black; border-radius: 22px;
//                                 -webkit-box-shadow:0 0 20px rgb(12, 114, 200); 
//                                 -moz-box-shadow: 0 0 20px rgb(12, 114, 200); 
//                                 box-shadow: 0 0 20px rgb(12, 114, 200);">
                            
//                             <li role = "presentation" class="dropdown-header" onclick="event.stopPropagation()"
//                                 style="display: block; cursor: default; font-size: 16px; font-weight: 600; padding-bottom: 15px; position: relative; padding-left: 15px;">
//                                 <div style="color: black;">Who can reply?</div>
//                                 <div style="font-size: 14px; font-weight: 450;">
//                                     Choose who can reply to this Tweet.<br> Anyone mentioned can always reply.
//                                 </div>
//                             </li>
//                             <li class="top-layer-tweet-who-can-reply-choice" data-who-can-reply-choice="0" style="position: relative; padding-left: 15px; padding-bottom: 10px; padding-top: 10px;">
//                                 <div style="display: flex; cursor: pointer;">
//                                     <div style="width: 40px; height: 40px; border-radius: 9999px; background-color: rgb(29, 155, 240); margin-right: 10px;">
//                                         <i id="top-layer-tweet-who-can-reply-icons-0" class="ri-earth-fill" style="display: block; color: white;
//                                             transform: translate(26%, 22%); font-size: 20px;"></i>
//                                     </div>
//                                     <div class="dropdown-item center-text-vertically" style="font-size: 16px; font-weight: 550;">
//                                         Everyone
//                                     </div>
//                                 </div>
//                             </li>
//                             <li class="top-layer-tweet-who-can-reply-choice" data-who-can-reply-choice="1" style="position: relative; padding-left: 15px; padding-bottom: 10px; padding-top: 10px;">
//                                 <div style="display: flex; cursor: pointer;">
//                                     <div style="width: 40px; height: 40px; border-radius: 9999px; background-color: rgb(29, 155, 240); margin-right: 10px;">
//                                         <i id="top-layer-tweet-who-can-reply-icons-1" class="fa fa-user" style="display: block; color: white;
//                                             transform: translate(32%, 49%); font-size: 20px;"></i>
//                                     </div>
//                                     <div class="dropdown-item center-text-vertically" style="font-size: 16px; font-weight: 550;">
//                                         People you follow
//                                     </div>
//                                 </div>
//                             </li>
//                             <li class="top-layer-tweet-who-can-reply-choice" data-who-can-reply-choice="2" style="position: relative; padding-left: 15px; padding-bottom: 10px; padding-top: 10px;">
//                                 <div style="display: flex; cursor: pointer;">
//                                     <div style="width: 40px; height: 40px; border-radius: 9999px; background-color: rgb(29, 155, 240); margin-right: 10px;">
//                                         <i id="top-layer-tweet-who-can-reply-icons-2" class="ri-at-line" style="display: block; color: white;
//                                             transform: translate(26%, 22%); font-size: 20px;"></i>
//                                     </div>
//                                     <div class="dropdown-item center-text-vertically" style="font-size: 16px; font-weight: 550;">
//                                         Only People you mention
//                                     </div>
//                                 </div>
//                             </li>
//                         </ul>
                        
//                         <hr style="margin-top: 5px; margin-bottom: 10px; border-top: 1px solid rgb(99, 155, 240);">
//                     </div>
                    
//                     <!-- BOTTOM-DIV -->
//                     <div style="display: flex; margin-top: 10px;">
//                         <div style="position: absolute; right: 30%; display: flex; margin-top: 0px; margin-right: 20px;">
                            
//                             <!-- BOTTOM-DIV-LOADER -->
//                             <div id="top-layer-tweet-count-loader" style="display: none; padding-right: 10px; margin-top: 9px;">

//                                 <div class="top-layer-tweet-count-loader-skill">
//                                     <div class="top-layer-tweet-count-loader-outer">
//                                         <div class="top-layer-tweet-count-loader-inner">
//                                         </div>
//                                     </div>
                
//                                     <svg class="top-layer-tweet-count-loader-skill-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="32px" height="32px">
//                                         <defs>
//                                         <linearGradient>
//                                             <stop offset="0%" stop-color="#e91e63" />
//                                             <stop offset="100%" stop-color="#673ab7" />
//                                         </linearGradient>
//                                         </defs>
//                                         <circle id="top-layer-tweet-count-loader-skill-circle-id" class="top-layer-tweet-count-loader-skill-circle" cx="16" cy="16" r="14" stroke-linecap="round" />
//                                     </svg>
//                                 </div>

//                             </div>

//                             <!-- TWEET-BUTTON -->
//                             <div id="top-layer-tweet-button"
//                                 style="cursor: pointer; border-radius: 9999px; padding: 10px 25px; background-color: rgb(26, 143, 238);
//                                         font-weight: 650; margin-left: 10px; margin-top: 5px;
//                                         color: white;"
//                                 class="top-layer-tweet-button-zero-text">Tweet</div>
//                         </div>
//                     </div>

//                     <div style="margin-top: 25px;">&nbsp;</div>

//                 </div>
//             </div>

//         </div>

//     </div>
// </div>