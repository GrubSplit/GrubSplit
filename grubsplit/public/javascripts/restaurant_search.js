(function () {

	$(document).on('click', '#currentLocation', function(evt) {
		var searchBar = document.getElementById('address');

		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};

		var success = function(position) {
			var coords = JSON.stringify({
				'latitude': position.coords.latitude,
				'longitude': position.coords.longitude
			});
			console.log(coords);
			searchBar.value = coords;
		}

		var error = function(err) {
			console.warn('ERROR(' + err.code + '): ' + err.message);
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error, options);
		} else { 
			console.warn('Geolocation is not supported by this browser.');
		}
	});
	
})();