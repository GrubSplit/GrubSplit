var Delivery = require('../../libraries/Delivery');

(function() {
  alert('HELLO');
  $(document).on('click', '#addPayment', function(event) {
    alert('Hello!');
    // location.href = Delivery.addPaymentMethodURL();
  });
})();