/* 
grubs.js

The controller for the grub page

author: aezhou	
*/

(function() {
	// Change subgrub's paid status
	$(document).on('click', '.togglePaid', function(evt) {
		var toggleButton = $(this)
		var subgrubContainer = toggleButton.parent().parent().parent()
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
				subgrubContainer.addClass('hasPaid');
				subgrubContainer.removeClass('hasNotPaid');
				toggleButton.removeClass('btn-success');
				toggleButton.addClass('btn-danger');
				toggleButton.text('Mark As Unpaid');
			} else {
				subgrubContainer.removeClass('hasPaid');
				subgrubContainer.addClass('hasNotPaid');
				toggleButton.addClass('btn-success');
				toggleButton.removeClass('btn-danger');
				toggleButton.text('Mark As Paid');
			}
			return;
		}).fail(function(resObj) {
			alert('Unable to save payment status change - please try again later!');
			return;
		});
	});


})();