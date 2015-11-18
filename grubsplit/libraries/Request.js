/**
 * Create an Http Request
 * @param {[type]}   method   Http method ('GET', 'POST')
 * @param {[type]}   url      endpoint for request
 * @param {[type]}   params   list of parameter tuples (ex. [["user_id", 123]])
 * @param {Function} callback Check if response was successful
 *
 * Author: mattmik
 */
var Request = function(method, url, params, callback) {
  var that = Object.create(Request.prototype);

  /**
   * Send an Http Request
   * @param  {XMLHttpRequest} request  To be sent
   * @param  {boolean} async           True if request is async
   */
  var send = function(request, async) {
    var form = new FormData();
    params.forEach(function(param) {
      form.append(param[0], param[1]);
    });

    // Send response to callback when request is successful
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        callback(request.responseText);
      }
    };

    request.open(method, url, async);
    reqest.send(form);
  };

  send(new XMLHttpRequest(), true);

  Object.freeze(that);
  return that;
};