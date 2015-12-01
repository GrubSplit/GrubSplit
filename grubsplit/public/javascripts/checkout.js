require('../../libraries/Delivery');

(function() {
  alert('HELLO');
  document.getElementById('addPayment').onclick = function() {
    alert('Hello!');
    // location.href = Delivery.addPaymentMethodURL();
  };
})();