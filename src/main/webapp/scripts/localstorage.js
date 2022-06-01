// function setCurrentUserIdInLS(userId) {
// 	localStorage.setItem(currentSignedInUserKey, userId);
// }

// function getCurrentUserIdInLS() {
// 	return localStorage.getItem(currentSignedInUserKey);
// }

// // Visibility Responser
// function respondToVisibility(element, callback, options = { root: null, rootMargin: '0px', threshold: 1 }) {

//     var observer = new IntersectionObserver(
//         (entries, observer) => entries.forEach(
//             entry => callback(entry.intersectionRatio > 0)
//             ) , options);

//     observer.observe(element);

//     return observer;

// }

// // Move to main

// const hashtagColor = "rgb(12, 114, 200)";

// const monthNames = ["January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"];

// function getNumberSuffix(num) {
//     return num / 10 % 10 == 1 ? 'th' : num % 10 == 1 ? 'st' : num % 10 == 2 ? 'nd' : num % 10 == 3 ? 'rd' : 'th';
// }

// function getDateForUserProfileFromTimestamp(timestamp) {
//     return getDateForUserProfileFromDate(new Date(timestamp));
// }

// function getDateForUserProfileFromDate(date) {
//     return date.getDate() + getNumberSuffix(date.getDate()) + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
// }

// function getTimeDifference(date1, date2) {

//     var difference = date1.getTime() - date2.getTime();

//     var daysDifference = Math.floor(difference/1000/60/60/24);
//     difference -= daysDifference*1000*60*60*24

//     var hoursDifference = Math.floor(difference/1000/60/60);
//     difference -= hoursDifference*1000*60*60

//     var minutesDifference = Math.floor(difference/1000/60);
//     difference -= minutesDifference*1000*60

//     var secondsDifference = Math.floor(difference/1000);

//     if (daysDifference == 0)
//         if (hoursDifference == 0)
//             if (minutesDifference == 0)
//                 return secondsDifference + 's';
//             else
//                 return minutesDifference + 'm';
//         else
//             return hoursDifference + 'h';
//     else if (daysDifference <= 7)
//         return daysDifference + 'd';

//     return getDateForUserProfileFromDate(date2);

// }

// function getTimeSpanFromNow(timestamp) {

//     return getTimeDifference(new Date(), new Date(timestamp));
    
// }

// function getTimestampFormattedValue(date) {
//     return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
// }

// Is meant to display the hashtag page, when clicked from a Tweet or something else
// The hashtag is passed here
// function onHashtagClicked(event, hashtag) {
//     event.stopPropagation();
//     console.log(hashtag);
// }

// function getResultWithHashtags(quote) {

//     var ans = ``;

//     if (quote == null)
//         return ans;

//     function getHashtagSpan(word) {
//         function onHashtagClicked(event, hashtag) {
//             onHashtagClicked(event, hashtag);
//         }
//         return `<span style="color: ` + hashtagColor + `; cursor: pointer;" onclick="onHashtagClicked(event, '` + word + `')">` + word + `</span>`;
//     }

//     for (const word of quote.split(' '))
//         ans += (word[0] == '#' ? getHashtagSpan(word) : word) + ` `;

//     return ans.trim();

// }

// // Is meant to display the user page, when clicked from a Tweet or something else
// // The user obj is passed here
// function userInfoClicked(user_id) {
//     console.log(user_id);
// }

// // Is meant to display the Tweet page, when clicked from a Tweet or something else
// // The tweet obj is passed here
// function tweetInfoClicked(tweet_id) {
//     console.log(tweet_id);
// }

// function replyClicked(replyDiv) {
//     console.log(replyDiv);
// }

// function getqqqq(tweet, user) {
//     return `
//         <div class="tweet-tool-icons" role="group">
//             <a id="single-tweet-tweet-reply-id-" style="cursor: pointer; display: flex;" onclick="replyClicked(this)">
//                 <i class="fa fa-reply" style="font-size: 20px;" aria-hidden="true"></i>
//                 <span style="margin-left: 10px; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);">` + tweet['total_replies'] + `</span>
//             </a>
//             <a id="single-tweet-tweet-retweet-id-" style="cursor: pointer; display: flex;">
//                 <i class="fa fa-retweet" style="font-size: 23px;"></i>
//                 <span style="margin-left: 10px; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);">` + tweet['total_retweets'] + `</span>
//             </a>
//             <a id="single-tweet-tweet-like-id-" style="cursor: pointer; display: flex;">
//                 <i class="fa fa-heart" style="font-size: 20px;"></i>
//                 <span style="margin-left: 10px; font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);">` + tweet['total_likes'] + `</span>
//             </a>
//             <a id="single-tweet-tweet-share-id-" style="font-size: 20px; cursor: pointer; display: flex;">
//                 <i class="fa fa-share"></i>
//             </a>
//         </div>
//     `;
// }

// function getSingleTweetForSecondColumnTweetsContainer(tweet, user) {
//     return `
//         <div>
//             <div class="tweet-in-list">
//                 <div style="display: flex;">
//                     <div style="margin-right: 10px;">
//                         <img id="single-tweet-profile-id-" onclick="userInfoClicked(` + user['id'] + `)" style="cursor: pointer; width: 50px; height: 50px; border-radius: 50%;" src="../images/default_profile.jpeg" alt="User Icon">
//                     </div>
//                     <div style="width: 100%;">
//                         <div style="display: flex; align-items: center; margin-bottom: 3px;">
//                             <a class="remove-link-underline tweet-tweeter-name" onclick="userInfoClicked(` + user['id'] + `)" style="margin-right: 5px; cursor: pointer;" role="link">
//                                 <span id="single-tweet-username-id">` + user['user_name'] + `</span>
//                             </a>
//                             <a class="remove-link-underline tweet-tweeter-id-name" onclick="userInfoClicked(` + user['id'] + `)" style="cursor: pointer;" role="link">
//                                 <span>@</span><span id="single-tweet-mention-id-">` + user['mention_name'] + `<span>
//                             </a>
//                             <span aria-hidden="true" style="margin: 0px 5px;">
//                                 <span>·</span>
//                             </span>
//                             <a class="remove-link-underline tweet-time-span" style="cursor: pointer;" rel="noopener noreferrer" target="_blank" role="link">
//                                 <span id="single-tweet-time-id-">` + getTimeSpanFromNow(tweet['created_at']) + `</span>
//                             </a>
//                         </div>

//                         <p id="single-tweet-tweet-id-" onclick="tweetInfoClicked('` + tweet['id'] + `')" style="cursor: pointer;">` + getResultWithHashtags(tweet['quote']) + `</p>

//                         ` + getqqqq(tweet, user) + `
                        
//                     </div>
//                 </div>
//             </div>
//             <hr style="margin-top: 4px; margin-bottom: 0;">
//         </div>
//     `;
// }

// function getQuotedRetweet(parent, child) {
//     return `
//         <div>
//             <div class="tweet-in-list">
//                 <div style="display: flex;">
//                     <div style="margin-right: 10px;">
//                         <img style="width: 50px; height: 50px; border-radius: 50%;" src="../images/icon_doge.jpeg" alt="User Icon">
//                     </div>
//                     <div style="width: 100%;">
//                         <div style="display: flex; align-items: center; margin-bottom: 3px;">
//                             <a class="remove-link-underline tweet-tweeter-name" style="margin-right: 5px;" href="#" role="link">
//                                 <span>` + child['user']['user_name'] + `</span>
//                             </a>
//                             <a class="remove-link-underline tweet-tweeter-id-name" href="#" role="link">
//                                 <span>@</span><span>` + child['user']['mention_name'] + `<span>
//                             </a>
//                             <span aria-hidden="true" style="margin: 0px 5px;">
//                                 <span>·</span>
//                             </span>
//                             <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
//                                 <span>` + getTimeSpanFromNow(child['tweet']['created_at']) + `</span>
//                             </a>
//                         </div>

//                         <p onclick="tweetInfoClicked('` + tweetInfoClicked(child['tweet']) + `')" style="cursor: pointer;">` + getResultWithHashtags(child['tweet']['quote']) + `</p>

//                         <div class="tweet-in-list" style="border: 1px solid black; border-radius: 10px;">
//                             <div style="display: flex;">
//                                 <div style="margin-right: 10px;">
//                                     <img style="width: 30px; height: 30px; border-radius: 50%;" src="../images/icon_doge.jpeg" alt="User Icon">
//                                 </div>
//                                 <div style="width: 100%;">
//                                     <div style="display: flex; align-items: center; margin-bottom: 3px;">
//                                         <a class="remove-link-underline tweet-tweeter-name" style="margin-right: 3px;" href="#" role="link">
//                                             <span>` + parent['user']['user_name'] + `</span>
//                                         </a>
//                                         <a class="remove-link-underline tweet-tweeter-id-name" href="#" role="link">
//                                             <span>@</span><span id="single-tweet-mention-id-">` + parent['user']['mention_name'] + `<span>
//                                         </a>
//                                         <span aria-hidden="true" style="margin: 0px 5px;">
//                                             <span>·</span>
//                                         </span>
//                                         <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
//                                             <span>` + getTimeSpanFromNow(parent['tweet']['created_at']) + `</span>
//                                         </a>
//                                     </div>

//                                     <p onclick="tweetInfoClicked('` + tweetInfoClicked(parent['tweet']) + `')" style="cursor: pointer; margin-bottom: 0;">` + getResultWithHashtags(parent['tweet']['quote']) + `</p>

//                                 </div>
//                             </div>
//                         </div>

//                         <div style="margin-top: 10px;">

//                             ` + getqqqq(child['tweet'], child['user']) + `

//                         </div>

//                     </div>
//                 </div>
//             </div>
//             <hr style="margin-top: 4px; margin-bottom: 0;">
//         </div>
//     `;
// }

// function getRetweet(user_id, parent, child) {
//     return `
//         <div>
//             <div class="tweet-in-list">
//                 <div style="display: flex; cursor: pointer;">
//                     <div>
//                         <i class="fa fa-retweet" style="font-size: 16px; margin-left: 30px;;"></i>
//                     </div>
//                     <div style="margin-left: 10px;" class="center-text-vertically">
//                         <div style="color: rgb(110, 110, 110); font-size: 13px; font-weight: 600;">
//                             <span>` + (child['user']['id'] == user_id ? "You" : "@" + child['user']['mention_name']) + `</span><span> Retweeted</span>
//                         </div>
//                     </div>
//                 </div>
//                 <div style="display: flex;">
//                     <div style="margin-right: 10px;">
//                         <img style="width: 50px; height: 50px; border-radius: 50%;" src="../images/icon_doge.jpeg" alt="User Icon">
//                     </div>
//                     <div style="width: 100%;">
//                         <div style="display: flex; align-items: center; margin-bottom: 3px;">
//                             <a class="remove-link-underline tweet-tweeter-name" style="margin-right: 5px;" href="#" role="link">
//                                 <span id="tweet-time">` + parent['user']['user_name'] + `</span>
//                             </a>
//                             <a class="remove-link-underline tweet-tweeter-id-name" href="#" role="link">
//                                 <span>@</span><span id="single-tweet-mention-id-">` + parent['user']['mention_name'] + `<span>
//                             </a>
//                             <span aria-hidden="true" style="margin: 0px 5px;">
//                                 <span>·</span>
//                             </span>
//                             <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
//                                 <span id="tweet-source-label">` + getTimeSpanFromNow(parent['tweet']['created_at']) + `</span>
//                             </a>
//                         </div>

//                         <p onclick="tweetInfoClicked('` + tweetInfoClicked(parent['tweet']) + `')" style="cursor: pointer; margin-bottom: 0;">` + getResultWithHashtags(parent['tweet']['quote']) + `</p>

//                         <div style="margin-top: 10px;">

//                             ` + getqqqq(parent['tweet'], parent['user']) + `

//                         </div>

//                     </div>
//                 </div>
//             </div>
//             <hr style="margin-top: 4px; margin-bottom: 0;">
//         </div>
//     `;
// }

// function getReply(parent, child) {
//     return `
//         <div>
//             <div class="tweet-in-list">
//                 <div style="display: flex; margin-bottom: 25px;">
//                     <div style="margin-right: 10px;">
//                         <div>
//                             <img style="width: 50px; height: 50px; border-radius: 50%;" src="../images/icon_doge.jpeg" alt="User Icon">
//                         </div>
//                         <div>
//                             <div style="height: 25px; border: 0.5px solid gray; width: 0; margin-left: 50%; margin-top: 2px;"></div>
//                         </div>
//                     </div>
//                     <div style="width: 100%;">
//                         <div style="display: flex; align-items: center; margin-bottom: 3px;">
//                             <a class="remove-link-underline" style="font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
//                                 <span>` + parent['user']['user_name'] + `</span>
//                             </a>
//                             <a class="remove-link-underline" style="font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
//                                 <span>@</span><span>` + parent['user']['mention_name'] + `<span>
//                             </a>
//                             <span aria-hidden="true" style="margin: 0px 5px;">
//                                 <span>·</span>
//                             </span>
//                             <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
//                                 <span>` + getTimeSpanFromNow(parent['tweet']['created_at']) + `</span>
//                             </a>
//                         </div>

//                         <p onclick="tweetInfoClicked('` + tweetInfoClicked(parent['tweet']) + `')" style="cursor: pointer;">` + getResultWithHashtags(parent['tweet']['quote']) + `</p>

//                         ` + getqqqq(parent['tweet'], parent['user']) + `

//                     </div>
//                 </div>
//                 <div style="border-radius: 10px;">
//                     <div style="display: flex;">
//                         <div style="margin-right: 10px;">
//                             <img style="width: 50px; height: 50px; border-radius: 50%;" src="../images/icon_doge.jpeg" alt="User Icon">
//                         </div>
//                         <div style="width: 100%;">
//                             <div style="display: flex; align-items: center; margin-bottom: 3px;">
//                                 <a class="remove-link-underline" style="font-size: 16px; font: bolder; font-weight: 650; color: black; margin-right: 5px;" href="#" role="link">
//                                     <span>` + child['user']['user_name'] + `</span>
//                                 </a>
//                                 <a class="remove-link-underline" style="font-size: 14px; font-weight: 500; color: rgb(110, 110, 110);" href="#" role="link">
//                                     <span>@</span><span>` + child['user']['mention_name'] + `<span>
//                                 </a>
//                                 <span aria-hidden="true" style="margin: 0px 5px;">
//                                     <span>·</span>
//                                 </span>
//                                 <a class="remove-link-underline tweet-time-span" href="#" rel="noopener noreferrer" target="_blank" role="link">
//                                     <span>` + getTimeSpanFromNow(child['tweet']['created_at']) + `</span>
//                                 </a>
//                             </div>

//                             <p onclick="tweetInfoClicked('` + tweetInfoClicked(child['tweet']) + `')" style="cursor: pointer;">` + getResultWithHashtags(child['tweet']['quote']) + `</p>

//                             ` + getqqqq(child['tweet'], child['user']) + `

//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <hr style="margin-top: 4px; margin-bottom: 0;">
//         </div>
//     `;
// }

// function setHomePage(user_id) {

//     $('#second-top-bar-title').text('Home');
//     $('#second-body').empty();

//     console.log('xxx');

//     $('#second-body').load('home.html');
//     $('#homeFeedsSpinnerId').show();

//     window.history.pushState("state-home.html", "Home", "p=home");

//     // var pageNo = 0;
//     // var pageSize = 10;
//     // var minTS = getTimestampFormattedValue(new Date());

//     // function loadMore() {
//     //     $.ajax({
//     //         url: base_url + "tweet/rfeeds?user_id=" + user_id +"&minTs=" + minTS + "&size=" + pageSize + "&start=" + pageNo + "",
//     //         type: "GET",
//     //         contentType: "application/json; charSet=UTF-8",
//     //         dataType: "json",
//     //         timeout: 2500,
//     //         success: function(tweetPieces) {

//     //             if (tweetPieces == null || tweetPieces.length == 0) {
//     //                 console.log("END REACHED DA!!! NO MORE TWEETS!!!!");
//     //                 endReached();
//     //                 return;
//     //             }

//     //             console.log(tweetPieces);

//     //             for (const tweetPiece of tweetPieces) {

//     //                 if (tweetPiece['type'] == "QUOTED")
//     //                     $('#second-body').append(getQuotedRetweet(tweetPiece['parent'], tweetPiece['child']));
//     //                 else if (tweetPiece['type'] == "RETWEET")
//     //                     $('#second-body').append(getRetweet(user_id, tweetPiece['parent'], tweetPiece['child']));
//     //                 else if (tweetPiece['type'] == "REPLY")
//     //                     $('#second-body').append(getReply(tweetPiece['parent'], tweetPiece['child']));
//     //                 else
//     //                     $('#second-body').append(getSingleTweetForSecondColumnTweetsContainer(tweetPiece['child']['tweet'], tweetPiece['child']['user']));
                    
//     //             }

//     //             pageNo += pageSize;

//     //         }, error: function(request, status, error) {
//     //             console.log('setHomePage', request.responseText, status, error);
//     //         }, complete: function() {
//     //         }
//     //     })
//     // }

//     // const observer = respondToVisibility(document.getElementById('homeFeedsSpinnerId'), visibile => {
//     //     if (!visibile)
//     //         return;

//     //     loadMore();
        
//     // })

//     // function endReached() {
//     //     $('#second-body').append(
//     //     `
//     //         <div>
//     //             <p>END</p>
//     //         </div>
//     //     `);
//     //     $('#homeFeedsSpinnerId').hide();
//     //     observer.disconnect();
//     // }

// }


// function addTweetsInUserProfileContainer(user) {

//     $.ajax({
// 		url: base_url + "tweet/" + user['id'],
// 		type: "GET",
// 		contentType: "application/json; charSet=UTF-8",
// 		dataType: "json",
// 		timeout: 2500,
// 		success: function(tweets) {

//             for (const tweet of tweets) {

//                 $("#second-column-user-tweet-nav-bar-container-qqqq").prepend(getSingleTweetForSecondColumnTweetsContainer(tweet, user));

//             }

//         }, error: function(request, status, error) {
// 			console.log('addTweetsInUserProfileContainer', request.responseText, status, error);
// 		}, complete: function() {
// 		}
// 	})

// }

// function showUserProfile(userId) {

//     $('#second-body').empty();

//     $.ajax({
// 		url: base_url + "user?id=" + userId,
// 		type: "GET",
// 		contentType: "application/json; charSet=UTF-8",
// 		dataType: "json",
// 		timeout: 2500,
// 		success: function(user) {

//             $('#second-top-bar-title').text(user['user_name']);

//             $('#second-body').append(
//                 `
//                     <div class="user-profile">
//                         <div>
//                             <img id="second-user-profile-bg-img-id" style="cursor: pointer; width: 100%; height: 250px;" src="../images/scenery.jpeg" alt="User Icon">
//                         </div>
//                         <div style="display: flex;">
//                             <div style="margin-top: -80px; margin-left: 15px;">
//                                 <img id="second-user-profile-img-id" style="cursor: pointer; width: 150px; height: 150px; border-radius: 50%; border: 3px solid black;" src="../images/default_profile.jpeg" alt="User Icon">
//                             </div>
//                             <div style="position: absolute; right: 30%; display: flex; margin-top: 10px; margin-right: 10px;">
//                                 <div style="cursor: pointer; border-radius: 9999px; border: 1px solid black; padding: 5px 15px; margin-right: 10px; display: none;">...</div>
//                                 <div id="second-user-profile-follow-button-id" style="cursor: pointer; border-radius: 9999px; border: 1px solid black; padding: 5px 15px; font-weight: 650; display: none;">Follow</div>
//                                 <div id="second-user-profile-edit-id" style="cursor: pointer; border-radius: 9999px; border: 1px solid black; padding: 5px 15px; font-weight: 650; margin-left: 10px;">Edit</div>
//                             </div>
//                         </div>
//                         <div style="margin-top: 5px; margin-left: 20px; margin-bottom: 5px;">
//                             <div id="second-user-profile-username-id" style="display: flex; cursor: pointer; font-weight: 700; font-size: 30px;">` + user['user_name'] + `</div>
//                             <div style="display: flex; cursor: pointer; font-weight: 500; font-size: 15px; margin-top: -8px; color: rgb(110, 110, 110);">
//                                 <span>@</span><span id="second-user-profile-mention-id">` + user['mention_name'] + `</span>
//                             </div>
//                             <div style="display: flex; font: Trebuchet MS, Helvetica, sans-serif; margin-top: 10px; font-weight: 500; color: rgb(81, 119, 215);">
//                                 ` + '`<i id="second-user-profile-status-id">' + getResultWithHashtags(user['status']) + '</i>`' + `
//                             </div>
//                             <div style="display: flex; margin-top: 20px;">
//                                 <i class="fa fa-calendar"></i>
//                                 <!-- <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" aria-hidden="true" class="r-1bwzh9t r-4qtqp9 r-yyyyoo r-1xvli5t r-1d4mawv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z"></path><circle cx="7.032" cy="8.75" r="1.285"></circle><circle cx="7.032" cy="13.156" r="1.285"></circle><circle cx="16.968" cy="8.75" r="1.285"></circle><circle cx="16.968" cy="13.156" r="1.285"></circle><circle cx="12" cy="8.75" r="1.285"></circle><circle cx="12" cy="13.156" r="1.285"></circle><circle cx="7.032" cy="17.486" r="1.285"></circle><circle cx="12" cy="17.486" r="1.285"></circle></g></svg> -->
//                                 <div style="cursor: pointer; font-weight: 500; font-size: 15px; margin-left: 5px; margin-top: -2px; color: rgb(110, 110, 110);">
//                                     <span>Joined </span><span id="second-user-profile-joined-id">` + getDateForUserProfileFromTimestamp(user['created_at']) + `</span>
//                                 </div>
//                             </div>
//                             <div style="display: flex; margin-top: 10px;">
//                                 <div style="cursor: pointer;">
//                                     <span id="second-user-profile-followee-count-id" style="font-weight: 700;">` + user['total_followees'] + `</span>
//                                     <span style="color: rgb(110, 110, 110)">Following</span>
//                                 </div>
//                                 <div style="cursor: pointer; margin-left: 20px;">
//                                     <span id="second-user-profile-follower-count-id" style="font-weight: 700;">` + user['total_followers'] + `</span>
//                                     <span id="second-user-profile-follower-span-id" style="color: rgb(110, 110, 110)">Follower` + (user['total_followers'] == 1 ? "" : "s") + `</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 `
//                 +
//                 `
//                     <div id="second-column-user-tweet-nav-bar-qqqq">
//                         <div class="center-items tweet-nav-bar-qqqq" role="group">
//                             <a id="tweet-nav-0" style="cursor: pointer;">
//                                 <span id="second-column-user-tweet-nav-title-0" class="tweet-nav-bar-qqqq-title-inactive">Tweets</span>
//                                 <div id="second-column-user-tweet-nav-bottom-bar-0" class="tweet-nav-bar-qqqq-bottom-bar-inactive"></div>
//                             </a>
//                             <a id="tweet-nav-1" style="cursor: pointer;">
//                                 <span id="second-column-user-tweet-nav-title-1" class="tweet-nav-bar-qqqq-title-inactive">Retweets</span>
//                                 <div id="second-column-user-tweet-nav-bottom-bar-1" class="tweet-nav-bar-qqqq-bottom-bar-inactive"></div>
//                             </a>
//                             <a id="tweet-nav-2" style="cursor: pointer;">
//                                 <span id="second-column-user-tweet-nav-title-2" class="tweet-nav-bar-qqqq-title-inactive">Replies</span>
//                                 <div id="second-column-user-tweet-nav-bottom-bar-2" class="tweet-nav-bar-qqqq-bottom-bar-inactive"></div>
//                             </a>
//                             <a id="tweet-nav-3" style="cursor: pointer;">
//                                 <span id="second-column-user-tweet-nav-title-3" class="tweet-nav-bar-qqqq-title-inactive">Likes</span>
//                                 <div id="second-column-user-tweet-nav-bottom-bar-3" class="tweet-nav-bar-qqqq-bottom-bar-inactive"></div>
//                             </a>
//                         </div>
//                         <hr style="margin-top: -1px;">
//                     </div>

//                     <div id="second-column-user-tweet-nav-bar-container-qqqq">
                        
//                     </div>
//                 `
//                 )

//             var prevId = 0;

//             function navClick(e) {

//                 var currId = this.id[this.id.length - 1];

//                 document.getElementById("second-column-user-tweet-nav-title-" + prevId).style.fontSize = "14px";
//                 document.getElementById("second-column-user-tweet-nav-title-" + prevId).style.fontWeight = "500";
//                 document.getElementById("second-column-user-tweet-nav-title-" + prevId).style.color = "rgb(110, 110, 110)";                
//                 $("#second-column-user-tweet-nav-bottom-bar-" + prevId).hide();

//                 document.getElementById("second-column-user-tweet-nav-title-" + currId).style.fontSize = "16px";
//                 document.getElementById("second-column-user-tweet-nav-title-" + currId).style.fontWeight = "600";
//                 document.getElementById("second-column-user-tweet-nav-title-" + currId).style.color = "black";
//                 $("#second-column-user-tweet-nav-bottom-bar-" + currId).show();

//                 addTweetsInUserProfileContainer(user);

//                 prevId = currId;

//                 return false;

//             }

//             $("#tweet-nav-0").click(navClick);
//             $("#tweet-nav-1").click(navClick);
//             $("#tweet-nav-2").click(navClick);
//             $("#tweet-nav-3").click(navClick);

//             $("#tweet-nav-0").click();

//             // $('#second-user-profile-id').show();

// 		}, error: function(request, status, error) {
// 			console.log('showUserProfile', request.responseText, status, error);
// 		}, complete: function() {
// 		}
// 	})

// }

// function initFirstColumn(user_id) {

//     $('#first-home-button-id').click(function () {
//         setHomePage(user_id);
//     })

//     $('#first-profile-button-id').click(function () {
//         showUserProfile(user_id);
//     })
// }

function setProfileImage(user_id, profile) {

    $.ajax({
		url: base_url + "user/meta?user_id=" + user_id + "&profile=" + profile,
		type: "POST",
		contentType: "application/json; charSet=UTF-8",
		dataType: "json",
		timeout: 2500,
		success: function(responseText) {
			console.log('profile pic uploaded: ', responseText);
		}, error: function(request, status, error) {
			console.log('profile pic upload error: ', request.responseText, status, error);
		}, complete: function() {
			console.log('');
		}
	})
}


// SELECT * FROM tweet_table WHERE created_at < CURRENT_TIMESTAMP ORDER BY (SELECT user_id IN (SELECT followee_id FROM follower_table WHERE follower_id=1)) DESC LIMIT 10, 10;


// function initPageForUser(userId) {

//     setHomePage(userId);


// }