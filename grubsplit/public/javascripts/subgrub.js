/* 
subgrub.js

The controller for the subgrub page

author: jorrieb	
*/
(function() {
	var cart = []

	$(function() {
    	redisplayCart()
	});
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

	var redisplayCart = function(){
		var cart = document.getElementById('cart')
		if (cart){
			element.parentNode.removeChild(cart);
		}
		var newCart = document.createElement("div");
		newCart.setAttribute('class', 'col-md-3 col-md-offset-7');
		newCart.setAttribute('id', 'cart');

		var items = document.createElement('h5');
		items.innerHTML = "Items"
		newCart.appendChild(items)

		var cost = document.createElement('h5');
		cost.innerHTML = "Cost"
		newCart.appendChild(cost)
		
		var submit = document.createElement('button');
		submit.innerHTML = "Submit"
		newCart.appendChild(submit)

		document.body.appendChild(newCart)

	}

	// Submit SubGrub to Grub
	$(document).on('click', '#submitSubGrub', function(evt) {
		if (cart.length === 0) {
			alert('Cart is empty! Add some items to the cart first.');
			return;
		}
		$.post(
			'/subgrubs/'+evt.subGrubId,
			{ items: cart }
		).done(function(res) {
			return;
		}).fail(function(resObj) {
			return;
		});
	});

	// User selects a menu item
	// Displays alert with:
	//	-options
	//	-quantity
	//	-comments/instructions
	//	-submit to cart button
	$(document).on('click', '.item', function(evt) {
		console.log(evt.currentTarget.getAttribute('itemid'))
		cart.push(evt.currentTarget.getAttribute('itemid'))
		redisplayCart()
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