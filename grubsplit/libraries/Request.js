/**
 * Send an Http Request
 * @param {[type]}   method   Http method ('GET', 'POST')
 * @param {[type]}   url      endpoint for request
 * @param {[type]}   params   list of parameters containing a tuple (ex. ["user_id", 123])
 * @param {Function} callback Check if response was successful
 *
 * TODO: Add listeners to check if reqeust was successful
 *       Store response
 *
 * Author: mattmik
 */
var Request = function (method, url, params, callback) {
  var that = Object.create(Request.prototype);

  var request = new XMLHttpRequest();

  /**
   * [send description]
   * @return {[type]} [description]
   */
  that.send = function () {
    var form = new FormData();
    params.forEach(function (param) {
      form.append(param[0], param[1]);
    });
    request.open(method, url);
    req.send(form);
  };

  Object.freeze(that);
  return that;
};