var Delivery = require('../libaries/Delivery');

/**
 * Represents a restaurant where a food order can be placed.
 * Attributes include:
 *   name
 *   id
 *   address - street, city, state, zip
 *   phone - 123-456-7890
 *   menu - List of MenuItems
 *
 * Author: mattmik
 */
var Restaurant = function(name) {
  var that = Object.create(Restaurant.prototype);

  var id, address, phone, menu;

  Delivery.getRestaurant(name, function(info) {
    id = info.id;
    address = Address(info.street, info.city, info.state, info.zip);
    phone = info.phone;
  });

  that.getName = function() {
    return name;
  };

  that.getId = function() {
    return id;
  };

  that.getAddress = function() {
    return address;
  };

  that.getPhone = function() {
    return phone;
  };

  that.getMenu = function() {
    return menu;
  };

  that.toString = function() {
    return ('% - %', name, address);
  };

  Object.freeze(that);
  return that;
};

var Address = function(street, city, state, zipCode) {
  var that = Object.create(Address.prototype);

  that.getStreet = function() {
    return street;
  };

  that.getCity = function() {
    return city;
  };

  that.getState = function() {
    return state;
  };

  that.getZipCode = function() {
    return zipCode;
  };

  that.toString = function() {
    return ('% %, % %', street, city, state, zipCode);
  };

  Object.freeze(that);
  return that;
};

// var PhoneNumber = function(location) {
//   var that = Object.create(PhoneNumber.prototype);

//   var phoneNumber = location.phone;

//   that.getPhoneNumber = function() {
//     return phoneNumber;
//   };

//   that.toString = function() {
//     return phoneNumber;
//   };

//   Object.freeze(that);
//   return that;
// };