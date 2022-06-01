// var jQueryScript = document.createElement('script');  
// jQueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js');
// document.head.appendChild(jQueryScript);

function signinUserPresentAlert(sleepTime) {
	swal({
		icon: "success",
		title: "Signed in!",
		text: "You will be redirected to home page!",
		buttons: false,
		timer: sleepTime
	});
}

function signinUserAbsentAlert() {
	swal({
		icon: 'error',
		title: 'Oops... Try again!!!',
		text: 'Username / Password not found!',
	})
}

function onPasswordEyeClicked(passwordField, icon) {
	$("#" + icon).toggleClass("fa-eye-slash")

	var password = $("#" + passwordField)

	if (password.attr("type") === "password")
		password.attr("type", "text");
	else
		password.attr("type", "password");
}

function onLoginClicked() {
	$('a[data-login-name=login]').toggleClass('login-nav-bar-on-click');
	$('a[data-login-name=signup').toggleClass('login-nav-bar-on-click');

	$('div[data-form-name=login]').toggleClass('login-signup-active-form');
	$('div[data-form-name=signup]').toggleClass('login-signup-active-form');
}

function onSignupClicked() {
	$('a[data-login-name=signup').toggleClass('login-nav-bar-on-click');
	$('a[data-login-name=login').toggleClass('login-nav-bar-on-click');

	$('div[data-form-name=signup]').toggleClass('login-signup-active-form');
	$('div[data-form-name=login]').toggleClass('login-signup-active-form');
}

function loginFormSubmit(e) {

	e.preventDefault();

	var loginUsernameInput = $('#loginUsernameInput').val()
	var loginPasswordInput = $('#loginPasswordInput').val()
	var loginRememberMe = $('#loginRememberMe').attr('checked')

	console.log("Logged in as: ", loginUsernameInput, loginPasswordInput, loginRememberMe);

	$.ajax({
		url: base_url + "user/db?username=" + loginUsernameInput + "&password=" + loginPasswordInput,
		type: "GET",
		contentType: "application/json; charSet=UTF-8",
		dataType: "json",
		timeout: 2500,
		success: function(result) {

			console.log('ok with ', result);
			if (~result) {

				signinUserPresentAlert(signinUserSuccessSleepTime);
				setCurrentUserIdInLS(result);
				setTimeout(function() {
					window.location.href = 'main.html';
				}, signinUserSuccessSleepTime)

			} else {
				signinUserAbsentAlert()
			}
		}, error: function(request, status, error) {
			console.log(request.responseText, status, error);
		}, complete: function() {
			console.log('done');

		}
	})
}
