// public javascript can't do direct calls to anything outside public. That needs to be done
// in routes, so you'll have to make an ajax call to get whatever Delivery stuff you need.
// require('../../libraries/Delivery');


(function() {
  $(document).on('click', '#submitOrder', function(event) {
    var location_id, cc_id, tip, href;
    tip = $('#tip').val();
    location_id = $('input[name=address]:checked').attr('id');
    cc_id = $('input[name=payment]:checked').attr('id');
    if (!tip || !location_id || !cc_id) {
      alert('Please select a delivery address, payment method, and leave a tip!');
      event.preventDefault();
    } else {
      $('#_tip').val(tip);
      $('#_location_id').val(location_id);
      $('#_cc_id').val(cc_id);
      $('#target').submit();
    }
  });
})();