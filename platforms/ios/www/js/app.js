var deviceReadyDeferred = $.Deferred();
var jqmReadyDeferred = $.Deferred();

$(document).on("deviceready", function() {
	deviceReadyDeferred.resolve();
});

$(document).on("mobileinit", function () {
	jqmReadyDeferred.resolve();
});

$.when(deviceReadyDeferred, jqmReadyDeferred).then(init);

var app = {
	save: function(id, object) {
		localStorage.setItem(id, JSON.stringify(object));
	},
	get: function(id) {
		return JSON.parse(localStorage.getItem(id));
	},
	watch: function(position) {
		var round = function(number) {return Math.round(number*1000)/1000;};

		var location = app.get('location');

		if (round(position.coords.latitude) === round(location.lat) && round(position.coords.longitude) === round(location.long)) {
			if (!location.reached) {
				navigator.notification.alert(location.message);
				location.reached = true;
			}
		} else {
			location.reached = false;
		}
		app.save('location', location);
	},
	initialize: function() {
		app.save('location', {
			reached: false
		});
		$('.inputs input').on('keyup', function() {
			var location = app.get('location');
			location.reached = false;
			location[$(this).attr('id')] = $(this).val();
			app.save('location', location);
		});
		$('.inputs input').trigger('keyup');
		navigator.geolocation.watchPosition(app.watch, null, {enableHighAccuracy: true});
	}
}

function init() {
	app.initialize()
}