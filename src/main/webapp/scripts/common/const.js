const x = 9000;

const uniqueLocalStoragePrefix = "twitter-two-point-o-qqqq-";
const currentSignedInUserKey = uniqueLocalStoragePrefix + "current-signed-in-user-key";
const signinUserSuccessSleepTime = 2000;
const base_url = "http://localhost:8080/twitter/rest/";


const tweetMaxChars = 280;

const whoCanReplyStrings = ['Everyone', 'People you follow', 'Only People you mention'];
const whoCanReplyIcons = ['ri-earth-fill', 'fa fa-user', 'ri-at-line'];