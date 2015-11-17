/**
 * Represents an item on a menu
 * Contains attributes
 *   name
 *   description
 *   price
 *   optionGroup - list of options (size, toppings)
 *     option - prince
 *
 * Author: mattmik
 */
var MenuItem = function () {
  var that = Object.create(MenuItem.prototype);



  Object.freeze(that);
  return that;
};