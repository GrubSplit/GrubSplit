var request = require('request');

/**
 * Library for retrieving data from Delivery.com's API
 *
 *   https://developers.delivery.com/overview/
 *
 * Author: mattmik
 */
var Delivery = function() {
  var that = Object.create(Delivery.prototype);

  var CLIENT_ID = 'MzNkNjI5MjhkODk4N2ZhNjgyYWE4MTBiYjIwZmJmMTQ5';
  var CLIENT_SECRET = 'xDfc7r6f5kCid33xIE6NrFeeROdgTW5E2064JV7Q';
  var REDIRECT_URI = 'https://grubsplit.herokuapp.com/auth';
  var DELIVERY_URL = 'https://api.delivery.com';

  /**
   * Delivery.com API endpoint for creating a new account
   * @return {String} URL
   */
  that.createAccountURL = function() {
    var url = DELIVERY_URL + '/third_party/account/create?';
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
    var url = DELIVERY_URL + '/third_party/authorize?';
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
    var url = DELIVERY_URL + '/third_party/access_token?';
    url += 'client_id=' + CLIENT_ID;
    url += '&client_secret=' + CLIENT_SECRET;
    url += '&redirect_uri=' + REDIRECT_URI;
    url += '&grant_type=' + 'authorization_code';
    url += '&code=' + code;

    request.post(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        var access_token = body.access_token;
        var refresh_token = body.refresh_token;
        var token_type = body.token_type;
        var expires = body.expires;
        var expires_in = body.expires_in;
        callback(null, {
          'access_token': access_token,
          'refresh_token': refresh_token,
          'token_type': token_type,
          'expires': expires,
          'expires_in': expires_in
        });
      } else {
        callback(error);
      }
    });
  };

  /**
   * Search for restaurants near a given address
   * @param  {String}   address  Address to search from
   * @param  {Function} callback {error, [restaurants]}
   *  address format:
   *      '123 Main Street Cambridge MA 02139'
   *  restaurant format:
   *      name
   *      id
   *      phone
   *      merchant_logo
   *      street
   *      city
   *      state
   *      zip_code
   */
  that.searchNearbyRestaurants = function(address, callback) {
    var url = DELIVERY_URL + '/merchant/search/delivery?';
    url += 'client_id=' + CLIENT_ID;
    url += '&address=' + address;
    url += '&merchant_type=R';

    var restaurants = [];
    request(url, function(error, response, body) {
      body = JSON.parse(body);
      if (body.message && body.message[0] && body.message[0].code) {
        if (body.message[0].code === 'invalid_address') {
          callback({
            msg: "We couldn't find that address. Please try again!"
          });
        }
      } else {
        body.merchants.forEach(function(restaurant) {
          restaurants.push({
            'name': restaurant.summary.name,
            'id': restaurant.id,
            'phone': restaurant.summary.phone,
            'merchant_logo': restaurant.summary.merchant_logo,
            'street': restaurant.location.street,
            'city': restaurant.location.city,
            'state': restaurant.location.state,
            'zip_code': restaurant.location.zip,
            // 'menu': menu
          });
        });
        callback(null, restaurants);
      }
    });
  };

  /**
   * Get menu info and parse response
   * @param  {int} restaurantId    Id for restaurant
   * @return {Function} callback   {error, menu}
   */
  var getMenu = function(restaurantId, callback) {
    var url = DELIVERY_URL + '/merchant/' + restaurantId + '/menu?';
    url += 'client_id=' + CLIENT_ID;
    request(url, function(error, response, body) {
      if (error || response.statusCode != 200) {
        error = error || {
          'message': [{
            'user_msg': response.statusCode
          }]
        };
        return callback(error);
      }
      body = JSON.parse(body);
      var menu = body.menu;
      callback(null, menu);
    });
  };

  /**
   * Get restaurant info and parse response
   * @param  {int} restaurantId     Id for restaurant
   * @return {JSON}                 Restaurant info
   *   attributes in response:
   *     name
   *     id
   *     phone
   *     merchant_logo
   *     street
   *     city
   *     state
   *     zip_code
   *     menu
   */
  that.getRestaurant = function(restaurantId, callback) {
    var url = DELIVERY_URL + '/merchant/' + restaurantId;
    url += '?client_id=' + CLIENT_ID;
    request(url, function(error, response, body) {
      if (error || response.statusCode != 200) {
        error = error || {
          'message': [{
            'user_msg': response.statusCode
          }]
        };
        return callback(error);
      }
      body = JSON.parse(body);
      var location = body.merchant.location;
      var summary = body.merchant.summary;
      getMenu(restaurantId, function(error, menu) {
        if (error) {
          callback(error);
        } else {
          callback(null, {
            'name': summary.name,
            'id': restaurantId,
            'phone': summary.phone,
            'merchant_logo': summary.merchant_logo,
            'street': location.street,
            'city': location.city,
            'state': location.state,
            'zip_code': location.zip,
            'menu': menu
          });
        }
      });
    });
  };

  /**
   * POST customer's address to Delivery.com API,
   *   returns location_id needed for order checkout
   * @param {Object}   address  {street, city, state, zip_code, phone}
   * @param {String}   token    access_token from user authorization
   * @param {Function} callback {error, location_id} used to checkout
   */
  that.addAddress = function(address, token, callback) {
    var url = DELIVERY_URL + '/customer/location?';
    url += 'client_id=' + CLIENT_ID;
    var options = {
      url: url,
      headers: {
        'Authorization': token
      },
      formData: {
        'street': address.street,
        'city': address.city,
        'state': address.state,
        'zip_code': address.zip_code,
        'phone': address.phone
      }
    };
    request.post(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        body = JSON.parse(body);
        if (body.location === undefined) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          var location = body.location;
          callback(null, location.location_id);
        }
      }
    });
  };

  /**
   * Update fields in a customer's address
   * @param  {String}   locationId Represents a customer's address
   * @param  {Object}   update     Fields to update (eg. {'city': Boston})
   * @param  {String}   token      access_token from user authorization
   * @param  {Function} callback   {error, location_id}
   */
  that.updateAddress = function(locationId, update, token, callback) {
    var url = DELIVERY_URL + '/customer/location/' + locationId + '?';
    url += 'client_id=' + CLIENT_ID;
    var options = {
      url: url,
      headers: {
        'Authorization': token
      },
      formData: update
    };
    request.put(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        body = JSON.parse(body);
        if (body.location === undefined) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          var location = body.location;
          callback(null, location.location_id);
        }
      }
    });
  };

  /**
   * Get customer's delivery addresses
   * @param  {String}   token    access_token from user authorization
   * @param  {Function} callback {error, locations}
   *   list of locations returned
   */
  that.getAddresses = function(token, callback) {
    var url = DELIVERY_URL + '/customer/location?';
    url += 'client_id=' + CLIENT_ID;
    var options = {
      url: url,
      headers: {
        'Authorization': token
      }
    };
    request(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        body = JSON.parse(body);
        if (body.locations === undefined) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          callback(null, body.locations);
        }
      }
    });
  };

  /**
   * Get customer's cart at a restaurant
   * @param  {Int}   restaurantId    Id for restaurant
   * @param  {String}   token        customer's access_token from authorization
   * @param  {Function} callback     {error, body}
   */
  that.getCart = function(restaurantId, token, callback) {
    var url = DELIVERY_URL + '/customer/cart/' + restaurantId + '?';
    url += 'client_id=' + CLIENT_ID;
    url += '&order_type=' + 'delivery';
    var options = {
      url: url,
      headers: {
        'Authorization': token
      }
    };
    request(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        body = JSON.parse(body);
        if (body.cart === undefined) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          callback(null, body);
        }
      }
    });
  };

  /**
   * Format order for the Delivery.com API
   * @param  {[Object]} items Items to add to order
   * @return {[Object]} order Properly formatted items for API
   */
  var formatOrder = function(items) {
    var order = [];
    items.forEach(function(item) {
      order.push({
        'item_id': item.id,
        'item_qty': item.quantity,
        'option_qty': item.option_qty,
        'item_label': '',
        'instructions': item.instructions
      });
    });
    return order;
  };

  /**
   * [createCart description]
   * @param  {int}   restaurantId    Id for restaurant
   * @param  {[Object]}   items      Items to order
   * @param  {String}   token        Customer's access_token from authorization
   * @param  {Function} callback     {error, body}
   */
  that.createCart = function(restaurantId, items, token, callback) {
    var url = DELIVERY_URL + '/customer/cart/' + restaurantId + '?';
    url += 'client_id=' + CLIENT_ID;
    url += '&order_type=' + 'delivery';
    items = formatOrder(items);
    var options = {
      url: url,
      body: {
        items: items
      },
      json: true,
      headers: {
        'Authorization': token,
      }
    };
    request.post(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        // body = JSON.parse(body);
        if (body.message.length > 0) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          callback(null, body);
        }
      }
    });
  };

  /**
   * Delete all items in customer's cart
   * @param  {int}   restaurantId    Id for restaurant
   * @param  {String}   token        Customer's access_token from authorization
   * @param  {Function} callback     {error, body}
   */
  that.deleteCart = function(restaurantId, token, callback) {
    var url = DELIVERY_URL + '/customer/cart/' + restaurantId + '?';
    url += 'client_id=' + CLIENT_ID;
    var options = {
      url: url,
      headers: {
        'Authorization': token
      }
    };
    request.delete(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        body = JSON.parse(body);
        if (body.message.length > 0) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          callback(null, body);
        }
      }
    });
  };

  /**
   * Remove an item from the cart by index
   * @param  {int}   restaurantId    Id for restaurant
   * @param  {[type]}   index        Index of item to delete from cart
   * @param  {String}   token        Customer's access_token from authorization
   * @param  {Function} callback     {error, body}
   */
  that.removeItem = function(restaurantId, index, token, callback) {
    var url = DELIVERY_URL + '/customer/cart/' + restaurantId + '?';
    url += 'client_id=' + CLIENT_ID;
    var options = {
      url: url,
      cart_index: index,
      headers: {
        'Authorization': token
      }
    };
    request.delete(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        body = JSON.parse(body);
        if (body.message.length > 0) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          callback(null, body);
        }
      }
    });
  };

  /**
   * Update a user's cart
   * @param  {[type]}   restaurantId [description]
   * @param  {[type]}   item         [description]
   * @param  {[type]}   token        [description]
   * @param  {Function} callback     [description]
   * @return {[type]}                [description]
   */
  that.updateCart = function(restaurantId, item, token, callback) {
      //TODO: Implement
  };

  /**
   * Retrieve a user's payment methods (credit cards)
   * @param  {String}   token    access_token from user authorization
   * @param  {Function} callback {error, [credit_card]}
   *   credit_card format:
   *     cc_id
   *     type
   *     exp_month
   *     exp_year
   */
  that.getPaymentMethods = function(token, callback) {
    var url = DELIVERY_URL + '/customer/cc';
    var options = {
      url: url,
      headers: {
        'Authorization': token
      }
    };
    request(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        body = JSON.parse(body);
        if (body.cards === undefined) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          callback(null, body.cards);
        }
      }
    });
  };

  /**
   * URL for adding payment methods, used for redirect
   * @param {String} state GrubSplit endpoint to return to after redirect
   */
  that.addPaymentMethodURL = function(state) {
    var url;
    state = state;
    url = DELIVERY_URL + '/third_party/credit_card/add?';
    url += 'client_id=' + CLIENT_ID;
    url += '&redirect_uri=' + REDIRECT_URI;
    url += '&response_type=code';
    url += '&scope=global';
    url += '&state=' + state;
    return url;
  };

  /**
   * Submit an order for delivery
   * @param  {String}   restaurantId Id for restaurant
   * @param  {String}   location_id  Id for delivery address
   * @param  {String}   cc_id        Id for payment method
   * @param  {String}   tip          Tip amount in dollars
   * @param  {String}   token        access_token from user authorization
   * @param  {Function} callback     {error, body}
   */
  that.placeOrder = function(restaurantId, location_id, cc_id, tip, token, callback) {
    var url;
    url = DELIVERY_URL + '/customer/cart/' + restaurantId + '/checkout?';
    url += 'client_id=' + CLIENT_ID;
    var options = {
      url: url,
      headers: {
        'Authorization': token,
        'User-Agent': 'Custom User Agent'
      },
      formData: {
        'tip': tip,
        'location_id': location_id,
        'payments[0][type]': 'credit_card',
        'payments[0][id]': cc_id,
        'order_type': 'delivery'
      }
    };
    request.post(options, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        // body = JSON.parse(body);
        if (body.message.length > 0) {
          var errors = body.message.map(function(obj) {return {'msg': obj.user_msg};});
          callback(errors);
        } else {
          callback(null, body);
        }
      }
    });
  };

  Object.freeze(that);
  return that;
};

module.exports = Delivery();