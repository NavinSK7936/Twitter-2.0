function setCurrentUserIdInLS(userId) {
	localStorage.setItem(currentSignedInUserKey, userId);
}

function getCurrentUserIdInLS() {
	return localStorage.getItem(currentSignedInUserKey);
}

function relateUsers(from_user, to_user) {

    console.log('gonna-relate', from_user, to_user);

    $.ajax({
		url: base_url + "user/relate?from_user=" + from_user + "&to_user=" + to_user,
		type: "POST",
		contentType: "application/json; charSet=UTF-8",
		dataType: "json",
		timeout: 2500,
		success: function(result) {

            console.log('users-related', from_user, to_user, result);

        }, error: function(request, status, error) {
			console.log('addTweetsInUserProfileContainer', request.responseText, status, error);
		}, complete: function() {
		}
	})
}