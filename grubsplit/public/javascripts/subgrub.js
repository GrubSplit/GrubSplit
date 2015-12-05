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
		submitButton.setAttribute('item_id', item_id);
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
			form.setAttribute('id', menuItem.children[index].id);
			if (menuItem.children[index].type == "price group"){
				for (child in menuItem.children[index].children){
					var label = document.createElement('label');
					label.setAttribute('class', 'option');
					label.innerHTML = menuItem.children[index].children[child].name;
					var button = document.createElement('input');
					button.setAttribute('type','radio');
					button.setAttribute('name', menuItem.children[index].id);
					button.setAttribute('value',menuItem.children[index].children[child].id);
					button.setAttribute('price',menuItem.children[index].children[child].price);
					button.innerHTML = menuItem.children[index].children[child].name;
					label.appendChild(button);
					form.appendChild(label);
				}
			} else {
				for (child in menuItem.children[index].children){
					var label = document.createElement('label');
					label.innerHTML = menuItem.children[index].children[child].name;
					label.setAttribute('class', 'option');
					var button = document.createElement('input');
					button.type = 'checkbox';
					button.setAttribute('name', menuItem.children[index].id);
					button.setAttribute('value',menuItem.children[index].children[child].id)
					button.setAttribute('price',menuItem.children[index].children[child].price);
					button.innerHTML = menuItem.children[index].children[child].name;
					label.appendChild(button);
					form.appendChild(label);
				}
			}
			content.appendChild(form);
		}
	};

	$(document).on('click', '#closeModal', function(evt) {
		closeModal();
	});

	$(document).on('click', '#submitButton', function(evt){
		item = menu.getItem(evt.currentTarget.getAttribute('item_id'));
		options = {};
		price = 0;
		for (optionGroupIndex in item.children){
			if (item.children[optionGroupIndex].type == "price group"){
				var checked = document.querySelector('input[name='+item.children[optionGroupIndex].id+']:checked');
				if (!checked){
					window.alert("Must select exactly one option");
					return;
				}
				options[checked.value] = 1;
				price = parseFloat(checked.getAttribute('price'));
			} else if (item.children[optionGroupIndex].type == "option group"){
				//this is the checked array
				var checked = document.querySelectorAll('input[name='+item.children[optionGroupIndex].id+']:checked');
				Array.prototype.map.call(checked, function(obj) {
					options[obj.value] = 1;
					price += parseFloat(obj.getAttribute('price'));
				});
			}
		}

		var quantity = parseInt(document.getElementById('quantity').value);
		if (quantity == 'NaN' || quantity < 1){
			window.alert("Invalid quantity");
			return;
		}

		var cartObject = {
			id: item.id,
			name: item.name,
			price: price,
			quantity: quantity,
			instructions: document.getElementById('instructionsBox').value,
			option_qty: options
		}

		cartArray.push(cartObject);
		redisplayCart();
		closeModal();

	});

	var closeModal = function(){
		var overlay = document.getElementById('overlay');
		overlay.parentNode.removeChild(overlay);
	};

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

})();