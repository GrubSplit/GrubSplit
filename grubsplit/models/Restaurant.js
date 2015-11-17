/**
 * Represents a restaurant where a food order can be placed.
 * Attributes include:
 *   name
 *   address - street, city, state, zip
 *   phoneNumber - (123) 456-7890
 *   menu - List of MenuItems
 *
 * Author: mattmik
 */
var Restaurant = function (name, address, phoneNumber, menu) {
  var that = Object.create(Restaurant.prototype);

  that.getName = function () {
    return name;
  };

  that.getAddress = function () {
    return address;
  };

  that.getPhoneNumber = function () {
    return phoneNumber;
  }

  that.getMenu = function () {
    return menu;
  };

  Object.freeze(that);
  return that;
};