function setCurrentUserIdInLS(userId) {
	localStorage.setItem(currentSignedInUserKey, userId);
}

function getCurrentUserIdInLS() {
	return localStorage.getItem(currentSignedInUserKey);
}
