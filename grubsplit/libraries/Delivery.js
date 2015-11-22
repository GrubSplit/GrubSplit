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

  /**
   * Delivery.com API endpoint for creating a new account
   * @return {String} URL
   */
  that.createAccountURL = function() {
    var url = 'https://api.delivery.com/third_party/account/create?';
    url += 'client_id=' + CLIENT_ID;
    url += '&redirect_uri=' + REDIRECT_URI;
    url += '&response_type=' + 'code';
    url += '&scope=' + 'global';
    url += '&state=';
    return url;
  };

  /**
   * Delivery.com API endpoint for authorizing an existing account
   * @return {String} URL
   */
  that.authorizeAccountURL = function() {
    var url = 'https://api.delivery.com/third_party/authorize?';
    url += 'client_id=' + CLIENT_ID;
    url += '&redirect_uri=' + REDIRECT_URI;
    url += '&response_type=' + 'code';
    url += '&scope=' + 'global';
    url += '&state=';
    return url;
  };

  /**
   * Delivery.com API endpoint for getting a user's access token
   * @param  {String}   code     Access code from /third_party/authorize endpoint
   * @param  {Function} callback returns {err, info about token}
   * @return {[type]}            [description]
   */
  that.requestTokenURL = function(code, callback) {
    var url = 'https://api.delivery.com/third_party/access_token?';
    url += 'client_id=' + CLIENT_ID;
    url += '&client_secret=' + CLIENT_SECRET;
    url += '&redirect_uri=' + REDIRECT_URI;
    url += '&grant_type=' + 'authorization_code';
    url += '&code=' + code;

    request.post(url, function(error, response, body) {
      body = JSON.parse(body);
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
      } else {
        console.log(error);
        console.log(JSON.stringify(response));
      }
    });
  };

  that.searchNearbyRestaurants = function (address, callback) {
    var url = 'https://api.delivery.com/merchant/search/delivery?';
    url += 'client_id=' + CLIENT_ID;
    url += '&address=' + address;
    that.getRestaurant('70706', function (err, restaurant) {
      callback(err, [restaurant]);
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
  that.getRestaurant = function(restaurantId, callback) {
    var url = 'https://api.delivery.com/merchant/' + restaurantId;
    url += '?client_id=' + CLIENT_ID;
    request(url, function(error, response, body) {
      if (error || response.statusCode != 200) {
        error = error || {'message': [{'user_msg': response.statusCode}]};
        return callback(error);
      }
      body = JSON.parse(body);
      var location = body.merchant.location;
      var summary = body.merchant.summary;
      console.log(body);
      console.log(location);
      console.log(summary);
      callback(null, {
        'name': summary.name,
        'id': restaurantId,
        'phone': summary.phone,
        'merchant_logo': summary.merchant_logo,
        'street': location.street,
        'city': location.city,
        'state': location.state,
        'zip_code': location.zip,
      });
    });
  };

  /**
   * Get menu info and parse response
   * @param  {int} restaurantId    Id for restaurant
   * @return {JSON}                Menu info
   *   attributes in response:
   *     menuItems
   */
  that.getMenu = function(restaurantId, callback) {
    var url = 'https://api.delivery.com/merchant/' + restaurantId + '/menu?';
    url += 'client_id=' + CLIENT_ID;
    request(url, function(error, response, body) {
      if (error || response.statusCode != 200) {
        error = error || {'message': [{'user_msg': response.statusCode}]};
        return callback(error);
      }
      var menu = response.menu;
      callback(null, {
        'menu': menu
      });
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