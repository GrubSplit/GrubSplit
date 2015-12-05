// Holds information about menu of current SubGrub.
// Menu is essentially an array of item objects which are referenced by item ID.
// No notion of submenus, only items.
// Menu is immutable.
// @param menu from delivery.com API

var Menu = function Menu(menu){

	var that = Object.create(Menu.prototype);
	var itemList = {};

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
	}

	// Public method which returns item object, complete
	// with option and price groups. 
	// @param itemID from delivery.com API
	that.getItem = function(itemID){
		return itemList[itemID]
	}

	addMenu(menu);

	Object.freeze(that)
	return that
};