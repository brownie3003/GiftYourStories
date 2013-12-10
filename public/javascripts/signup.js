$(document).ready(function() {
	$("#signupNext").click(function(e) {
		e.preventDefault();
		mixpanel.track('signup_first_clicked', {}, function() {
			$("#firstForm").submit();
		});
	});

	$("#signup2Next").click(function(e) {
		e.preventDefault();
		mixpanel.track('entered_email_name_continue', {}, function() {
			$("#secondForm").submit();
		});
	});

	$("#sendFamily").click(function(e) {
		e.preventDefault();
		mixpanel.track('family_submitted', {}, function() {
			$("#familyForm").submit();
		})
	})
	


});