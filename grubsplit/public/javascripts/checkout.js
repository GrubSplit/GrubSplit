// public javascript can't do direct calls to anything outside public. That needs to be done
// in routes, so you'll have to make an ajax call to get whatever Delivery stuff you need.
// require('../../libraries/Delivery');

(function() {
  alert('HELLO');
  document.getElementById('addPayment').onclick = function() {
    alert('Hello!');
    // location.href = Delivery.addPaymentMethodURL();
  };
})();