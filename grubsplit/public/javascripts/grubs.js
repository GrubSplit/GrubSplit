/* 
grubs.js

The controller for the grub page

author: aezhou	
*/

(function() {

	// Change subgrub's paid status
	$(document).on('click', '.togglePaid', function(evt) {
		console.log('button clicked oh hello')
		var url = '/subgrubs'
		var payAction = false;
		var toggleButton = $(this)
		if (toggleButton.hasClass('.hasPaid')) {
			url += '/unpay/' + $(this).attr('subgrubid');
		} else if ($(this).hasClass('.hasNotPaid')) {
			url += '/pay/' + $(this).attr('subgrubid');
			payAction = true;
		}

		$.post(
			url,
			{ markAsPaid: payAction }
		).done(function(res) {
			if (toggleButton.hasClass('.hasPaid')) {
				toggleButton.removeClass('.hasPaid');
				toggleButton.addClass('.hasNotPaid')
			} else if ($(this).hasClass('.hasNotPaid')) {
				toggleButton.addClass('.hasPaid');
				toggleButton.removeClass('.hasNotPaid')
			}
			window.location.replace(res);
			return;
		}).fail(function(resObj) {
			alert('Unable to save payment status change - please try again later!');
			return;
		});
	});


})();