// Holds information about menu of current SubGrub.
// Menu is essentially an array of item objects which are referenced by item ID.
// No notion of submenus, only items.
// Menu is immutable.
// @param menu from delivery.com API

var Menu = function Menu(menu){

	var that = Object.create(Menu.prototype);
	var itemList = {};
	var optionList = {};

	// Private method to add menu's items to menu object.
	// Used only when generating menu.
	// @param menu from delivery.com API
	var addMenu = function(subMenu){
		for (index in subMenu) {
			if (subMenu[index].type == "menu"){
				addMenu(subMenu[index].children)
			} else {
				addItem(subMenu[index]);
			}
		}
	}

	// Private method to add item to menu object.
	// Used only when generating menu.
	// @param item from delivery.com API
	var addItem = function(item){
		itemList[item.id] = item
		for (index in item.children){
			if (item.children[index].type == "price group" || item.children[index].type == "option group"){
				addGroup(item.children[index]);
			} else {
				addOption(item.children[index]);
			}
		}
	}

	var addGroup = function(group){
		for (index in group.children){
			if (group.children[index].type == "price group" || group.children[index].type == "option group"){
				addGroup(group[index]);
			} else {
				addOption(group.children[index]);
			}
		}
	}

	var addOption = function(option){
		optionList[option.id] = option;
	}

	// Public method which returns item object, complete
	// with option and price groups. 
	// @param itemID from delivery.com API
	that.getItem = function(itemID){
		return itemList[itemID]
	}

	that.getOption = function(optionID){
		return optionList[optionID];
	}

	addMenu(menu);

	Object.freeze(that)
	return that
};