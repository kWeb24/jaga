OpenWeatherMap = function() {
  this.APIURL = 'http://api.openweathermap.org/data/2.5/weather';
  this.init();
};

OpenWeatherMap.prototype = Object.create(OpenWeatherMap);
OpenWeatherMap.prototype.constructor = OpenWeatherMap;

OpenWeatherMap.prototype.init = function() {
  var self = this;
	//this.getCityWeather("Bojanowo");
	this.setCurrentTimeFromSystem();
  // setInterval(function() {
  // }, 1500);
};

OpenWeatherMap.prototype.getCityWeather = function(city) {
  $.ajax({
		type: 'GET',
		url: this.APIURL,
		data: {
				q: city,
				appid: apiKeys.openweather
		},
		success: function(result, status, xhr) {
			var weather = result;
			console.log(weather);
		},
		error: function(xhr, status, error) {
		}
	});
};

OpenWeatherMap.prototype.setCurrentTimeFromSystem = function() {
	moment.locale('pl');
	var dateElements = $('.slide__element--date');
	var currentDate = moment().format('dddd[, ]D MMMM YYYY');
	$(dateElements).text(currentDate);
};
