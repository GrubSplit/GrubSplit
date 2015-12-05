/* 
subgrub.js

The controller for the subgrub page

author: jorrieb	
*/

(function() {
	var cartArray = []
	var menu = {}

	$(function() {
		var subgrubButton = document.getElementById('submitSubGrub')
		var subgrubid = subgrubButton.getAttribute('subgrubid')

		$.get('/subgrubs/items/' + subgrubid, function(response) {
			cartArray = response;
    		redisplayCart()
		});

		$.get('/subgrubs/menu/' + subgrubid, function(response){
			menu = Menu(response);
			console.log(menu);
		});
	});

	var redisplayCart = function(){

		var subgrubButton = document.getElementById('submitSubGrub')
		var subgrubid = subgrubButton.getAttribute('subgrubid')
		subgrubButton.parentNode.removeChild(subgrubButton);

		var cart = document.getElementById('cart')
		if (cart){
			cart.parentNode.removeChild(cart);
		}
		var newCart = document.createElement("div");
		newCart.setAttribute('class', 'col-md-3 col-md-offset-7 cart');
		newCart.setAttribute('id', 'cart');

		var items = document.createElement('h4');
		items.innerHTML = "<b>Items:</b>"

		for (var item in cartArray){
			var displayedItem = document.createElement('p')
			displayedItem.innerHTML = '<b>' + cartArray[item].name + '</b> - $' + cartArray[item].price + '<br>Quantity: ' + cartArray[item].quantity 
			items.appendChild(displayedItem)
		}

		newCart.appendChild(items)

		var cost = document.createElement('h4');
		cost.innerHTML = "<b>Total Cost:</b>"

		var price = 0
		for (var item in cartArray){
			 price += (parseFloat(cartArray[item].price) * parseFloat(cartArray[item].quantity))
		}
		var orderPrice = document.createElement('p');
		orderPrice.innerHTML = '$'.concat(price.toFixed(2).toString())
		cost.appendChild(orderPrice)

		newCart.appendChild(cost)

		var submit = document.createElement('button');
		submit.innerHTML = "Submit SubGrub"
		submit.setAttribute('id','submitSubGrub')
		submit.setAttribute('subgrubid', subgrubid)
		submit.setAttribute('class', 'btn btn-primary')
		newCart.appendChild(submit)

		document.body.appendChild(newCart)
	}

	// Submit SubGrub to Grub
	$(document).on('click', '#submitSubGrub', function(evt) {
		if (cartArray.length === 0) {
			alert('Cart is empty! Add some items to the cart first.');
			return;
		}
		var url = '/subgrubs/'+$('#submitSubGrub').attr('subgrubid');
		console.log(cartArray);
		$.post(
			url,
			{ items: JSON.stringify(cartArray) }
		).done(function(res) {
			window.location.replace(res);
			return;
		}).fail(function(resObj) {
			// TODO: What to do here?
			return;
		});
	});

	$(document).on('click','#overlay', function(evt){
		// evt.preventDefault();

	});

	// User selects a menu item
	// Displays alert with:
	//	-options
	//	-quantity
	//	-comments/instructions
	//	-submit to cart button
	$(document).on('click', '.item', function(evt) {
		var item = evt.currentTarget
		//create modal with item data
		presentModal(item.getAttribute('itemid'),'menuitem');

	});

	var presentModal = function(item_id,id_type){
		console.log('menu is',menu);
		//generic things
		var overlay = document.createElement('div');
		overlay.setAttribute('id','overlay');
		document.body.appendChild(overlay);

		var orderBox = document.createElement('div');
		orderBox.setAttribute('id','orderBox');
		overlay.appendChild(orderBox);

		var header = document.createElement('div');
		header.setAttribute('class','modalRow');
		header.setAttribute('id','header');
		orderBox.appendChild(header);

		var closeButton = document.createElement('button');
		closeButton.setAttribute('id', 'closeModal');
		closeButton.innerHTML = 'Close';
		header.appendChild(closeButton);

		var content = document.createElement('div');
		content.setAttribute('class','modalRow');
		content.setAttribute('id','content');
		orderBox.appendChild(content);

		var textRow = document.createElement('div');
		textRow.setAttribute('class','modalRow');
		textRow.setAttribute('id','textRow');
		orderBox.appendChild(textRow);

		var instructions = document.createElement('textarea');
		instructions.setAttribute('class','FormElement');
		instructions.setAttribute('placeHolder','Add your order instructions here! e.g. Peanut Allergy');
		instructions.setAttribute('id','instructionsBox');
		instructions.setAttribute('rows','4');
		textRow.appendChild(instructions);

		var footer = document.createElement('div');
		footer.setAttribute('class','modalRow');
		footer.setAttribute('id','footer');
		orderBox.appendChild(footer);

		var quantLabel = document.createElement('h5');
		quantLabel.innerHTML = 'Quantity:';
		footer.appendChild(quantLabel);

		var quantInput = document.createElement('input');
		quantInput.setAttribute('id', 'quantity');
		quantInput.defaultValue = 1;
		footer.appendChild(quantInput);

		var submitButton = document.createElement('button');
		submitButton.setAttribute('id','submitButton');
		submitButton.innerHTML = 'Submit to Cart';
		footer.appendChild(submitButton);

		var itemName = document.createElement('h2');
		var menuItem = menu.getItem(item_id);
		itemName.innerHTML = menuItem.name;
		content.appendChild(itemName);

		for (index in menuItem.children){
			var groupName = document.createElement('h4');
			groupName.innerHTML = menuItem.children[index].name;
			content.appendChild(groupName);
			var form = document.createElement('form');
			if (menuItem.children[index].type == "price group"){
				for (child in menuItem.children[index].children){
					var button = document.createElement('input');
					button.setAttribute('type','radio');
					button.setAttribute('name', menuItem.children[index].id);
					button.setAttribute('value',menuItem.children[index].children[child].name);
					button.innerHTML = menuItem.children[index].children[child].name;
					$(button).text(menuItem.children[index].children[child].name);
					// button.setAttribute('checked',true);
					form.appendChild(button);
				}
			} else {
				for (child in menuItem.children[index].children){
					var button = document.createElement('input');
					button.type = 'checkbox';
					button.setAttribute('name', menuItem.children[index].id);
					button.setAttribute('value',menuItem.children[index].children[child].name)
					button.innerHTML = menuItem.children[index].children[child].name;
					form.appendChild(button);
				}
			}
			content.appendChild(form);
		}

	};

	$(document).on('click', '#closeModal', function(evt) {
		closeModal();
	});

	$(document).on('click', '#submitButton', function(evt){
		//save to cart
		closeModal();

	});

	var closeModal = function(){
		var overlay = document.getElementById('overlay');
		overlay.parentNode.removeChild(overlay);
	};

	// $(document).on('click', '.item', function(evt) {
	// 	var item = evt.currentTarget
	// 	var exists = false;
	// 	for (var index in cartArray) {
	// 		var cartObject = cartArray[index]
	// 		if (cartObject.id === item.getAttribute('itemid')) {
	// 			cartObject.quantity += 1;
	// 			exists = true;
	// 			break;
	// 		}
	// 	}
	// 	if (!exists) {
	// 		var cartObject = {
	// 			id: item.getAttribute('itemid'),
	// 			name: item.getAttribute('name'),
	// 			price: item.getAttribute('price'),
	// 			quantity: 1
	// 		}
	// 		cartArray.push(cartObject)
	// 	}
	// 	redisplayCart()
	// });

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