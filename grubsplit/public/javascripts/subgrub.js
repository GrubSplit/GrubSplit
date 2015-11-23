/* 
subgrub.js

The controller for the subgrub page

author: jorrieb	
*/
(function() {

	// Helper to display the alert view for the subgrubs
	// params:
	//	-item = the item to be displayed. 
	//	-quantity = optional - number of items in the cart
	//	-selectedOptions = optional - 
	var displayMenuItem = function(item,quantity,selectedOptions,instructions){
		//set default values
		quantity = typeof quantity !== 'undefined' ? quantity : 0;
		selectedOptions = typeof selectedOptions !== 'undefined' ? selectedOptions : [];
		instructions = typeof instructions !== 'undefined' ? instructions : '';

		//toss up a jade template
	};

	// Submit SubGrub to Grub
	// 
	$(document).on('click', '#submitSubGrub', function(evt) {
		//post submit to subgrub
	});

	// User selects a menu item
	// Displays alert with:
	//	-options
	//	-quantity
	//	-comments/instructions
	//	-submit to cart button
	$(document).on('click', '.item', function(evt) {
		console.log('clicked an item')
		console.log(evt)
		console.log(evt.currentTarget)
		// console.log(evt.currentTarget)
		//get id of clicked element
		//item = item from menu using id
		//displayMenuItem(item)
	});

	// Remove item from cart
	$(document).on('click', '.removeItem', function(evt) {
		//get item id
		//put to subgrub cart
	});

	// Edit item in cart
	$(document).on('click', '.editItem', function(evt) {
		//get item info
		//displayMenuItem(item,additional info)
	});

	// Cancel subgrub
	$(document).on('click', '#cancelSubGrub', function(evt) {
		//remove subgrub from the db
		//navigate to the 
		//displayMenuItem(item,additional info)
	});

})();