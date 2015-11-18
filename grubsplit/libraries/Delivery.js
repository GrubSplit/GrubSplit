var request = require('request');
/**
 * Library for retrieving data from Delivery.com's API by
 *   parsing information from responses
 *
 * Author: mattmik
 */
var Delivery = function() {
  var that = Object.create(Delivery.prototype);

  var CLIENT_ID = 'MzNkNjI5MjhkODk4N2ZhNjgyYWE4MTBiYjIwZmJmMTQ5';

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
    var url = ('https://api.delivery.com/merchant/%?', restaurantId);
    url += 'client_id=' + CLIENT_ID;
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var location = response.location;
        var summary = response.summary;
        callback({
          'name'    : summary.name,
          'phone'   : summary.phone,
          'street'  : location.street,
          'city'    : location.city,
          'state'   : location.state,
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
  that.getMenu = function(restaurantId) {

  };

  /**
   * Place an order
   * @param  {[type]} order [description]
   * @return {[type]}       [description]
   */
  that.placeOrder = function(order) {

  };

  /**
   * Authenticate a user
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  that.authenticate = function(user) {

  };

  Object.freeze(that);
  return that;
};

module.exports = Delivery();