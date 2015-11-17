/**
 * Represents an item on a menu
 * Contains attributes
 *   name
 *   description
 *   price
 *   id
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