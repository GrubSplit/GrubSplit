/**
 * Represents a restaurant where a food order can be placed.
 * Attributes include:
 *   name
 *   id
 *   address - street, city, state, zip
 *   phoneNumber - (123) 456-7890
 *   menu - List of MenuItems
 *
 * Author: mattmik
 */
var Restaurant = function (name, id, address, phoneNumber, menu) {
  var that = Object.create(Restaurant.prototype);

  that.getName = function () {
    return name;
  };

  that.getId = function () {
    return id;
  };

  that.getAddress = function () {
    return address;
  };

  that.getPhoneNumber = function () {
    return phoneNumber;
  };

  that.getMenu = function () {
    return menu;
  };

  that.toString = function () {
    return ('% - %', name, address);
  };

  Object.freeze(that);
  return that;
};

var Address = function (location) {
  var that = Object.create(Address.prototype);

  var street, city, state, zipCode;

  street = location.street;
  city = location.city;
  state = location.state;
  zipCode = location.zipCode;

  that.getStreet = function () {
    return street;
  };

  that.getCity = function () {
    return city;
  };

  that.getState = function () {
    return state;
  };

  that.getZipCode = function () {
    return zipCode;
  };

  that.toString = function () {
    return ('% %, % %', street, city, state, zipCode);
  };

  Object.freeze(that);
  return that;
};

var PhoneNumber = function (location) {
  var that = Object.create(PhoneNumber.prototype);

  var phoneNumber = location.phone;

  that.getPhoneNumber = function () {
    return phoneNumber;
  };

  that.toString = function () {
    return phoneNumber;
  };

  Object.freeze(that);
  return that;
}