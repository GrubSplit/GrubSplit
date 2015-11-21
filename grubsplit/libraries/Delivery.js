var request = require('request');

var RESTAURANT_IDS = {
  'Cafe 472': 70706
};

/**
 * Library for retrieving data from Delivery.com's API by
 *   parsing information from responses
 *
 * Author: mattmik
 */
var Delivery = function() {
  var that = Object.create(Delivery.prototype);

  var CLIENT_ID = 'MzNkNjI5MjhkODk4N2ZhNjgyYWE4MTBiYjIwZmJmMTQ5';
  var CLIENT_SECRET = 'xDfc7r6f5kCid33xIE6NrFeeROdgTW5E2064JV7Q';
  var REDIRECT_URI = 'https://localhost:3000/auth';
  var RESPONSE_TYPE = 'code';

  var RESTAURANT_IDS = {
    'Cafe 472': 70706
  };


  that.createAccountURL = function(callback) {
    var url = 'https://api.delivery.com/third_party/account/create?';
    url += 'client_id=' + CLIENT_ID;
    url += '&redirect_uri=' + REDIRECT_URI;
    url += '&response_type=' + RESPONSE_TYPE;
    url += '&scope=' + 'global';
    url += '&state=';
    return url;
  };

  that.authorizeAccountURL = function(callback) {
    var url = 'https://api.delivery.com/third_party/authorize?';
    url += 'client_id=' + CLIENT_ID;
    url += '&redirect_uri=' + REDIRECT_URI;
    url += '&response_type=' + RESPONSE_TYPE;
    url += '&scope=' + 'global';
    url += '&state=';
    return url;
  };

  that.requestTokenURL = function(code, callback) {
    var url = 'https://api.delivery.com/third_party/access_token?';
    url += 'client_id=' + CLIENT_ID;
    url += '&client_secret=' + CLIENT_SECRET;
    url += '&redirect_uri=' + REDIRECT_URI;
    url += '&grant_type=' + 'authorization+code';
    url += '&code=' + code;

    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var access_token = body.access_token;
        var refresh_token = body.refresh_token;
        var token_type = body.token_type;
        var expires = body.expires;
        var expires_in = body.expires_in;
        callback({
          'access_token': access_token,
          'refresh_token': refresh_token,
          'token_type': token_type,
          'expires': expires,
          'expires_in': expires_in
        });
      }
    });
  };

  /**
   * Get restaurant info and parse response
   * @param  {int} restaurantId     Id for restaurant
   * @return {JSON}                 Restaurant info
   *   attributes in response:
   *     name
   *     address
   *     phoneNumber
   */
  that.getRestaurant = function(restaurant, callback) {
    var restaurantId = RESTAURANT_IDS[restaurant];
    var url = ('https://api.delivery.com/merchant/%?', restaurantId);
    url += 'client_id=' + CLIENT_ID;
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var location = response.location;
        var summary = response.summary;
        callback({
          'name': summary.name,
          'id': restaurantId,
          'phone': summary.phone,
          'street': location.street,
          'city': location.city,
          'state': location.state,
          'zip_code': location.zip_code
        });
      }
    });
  };

  /**
   * Get menu info and parse response
   * @param  {int} restaurantId    Id for restaurant
   * @return {JSON}                Menu info
   *   attributes in response:
   *     menuItems
   */
  that.getMenu = function(restaurant, callback) {
    var restaurantId = RESTAURANT_IDS[restaurant];
    var url = ('https://api.delivery.com/merchant/%/menu?', restaurantId);
    url += 'client_id=' + CLIENT_ID;
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var menu = response.menu;
        callback({
          'menu': menu
        });
      }
    });
  };

  /**
   * Place an order
   * @param  {[type]} order [description]
   * @return {[type]}       [description]
   */
  that.placeOrder = function(order) {

  };

  Object.freeze(that);
  return that;
};

module.exports = Delivery();