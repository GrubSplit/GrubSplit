/* 
grubs.js

The controller for the grub page

author: aezhou	
*/

(function() {
	// Change subgrub's paid status
	$(document).on('click', '.togglePaid', function(evt) {
		var toggleButton = $(this)
		console.log(toggleButton)
		var subgrubContainer = toggleButton.parent().parent()
		var url = '/subgrubs/payment/' + toggleButton.attr('subgrubid')
		var payAction = false;

		if (toggleButton.text() === 'Mark As Paid') {
			payAction = true;
		}

		$.post(
			url,
			{ markAsPaid: payAction }
		).done(function(res) {
			if (payAction) {
				console.log('changing css to being paid')
				subgrubContainer.addClass('hasPaid');
				subgrubContainer.removeClass('hasNotPaid');
				toggleButton.removeClass('btn-success');
				toggleButton.addClass('btn-danger');
				toggleButton.text('Mark As Unpaid');
			} else {
				console.log('changing css to being unpaid')
				subgrubContainer.removeClass('hasPaid');
				subgrubContainer.addClass('hasNotPaid');
				toggleButton.addClass('btn-success');
				toggleButton.removeClass('btn-danger');
				toggleButton.text('Mark As Paid');
			}
			// window.location.replace(res)
			return;
		}).fail(function(resObj) {
			alert('Unable to save payment status change - please try again later!');
			return;
		});
	});


})();