OpenWeatherMap = function() {
  this.APIWeather = 'http://api.openweathermap.org/data/2.5/weather';
	this.APIForecast = 'http://api.openweathermap.org/data/2.5/forecast';
  this.init();
};

OpenWeatherMap.prototype = Object.create(OpenWeatherMap);
OpenWeatherMap.prototype.constructor = OpenWeatherMap;

OpenWeatherMap.prototype.init = function() {
  var self = this;
	this.getCityWeather("Bojanowo");
	this.getCityForecast("Bojanowo");
	this.setCurrentTimeFromSystem();

	$('.current-time-clock').html(self.getCurrentTimeFromSystem());
  setInterval(function() {
		$('.current-time-clock').html(self.getCurrentTimeFromSystem());
  }, 1000);
};

OpenWeatherMap.prototype.getCityWeather = function(city) {
  $.ajax({
		type: 'GET',
		url: this.APIWeather,
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

OpenWeatherMap.prototype.getCityForecast = function(city) {
	$.ajax({
		type: 'GET',
		url: this.APIForecast,
		data: {
				q: city,
				appid: apiKeys.openweather
		},
		success: function(result, status, xhr) {
			var forecast = result;
			console.log(forecast);
		},
		error: function(xhr, status, error) {
		}
	});
};

OpenWeatherMap.prototype.setCurrentTimeFromSystem = function() {
	moment.locale('pl');
	var dateElements = $('.current-time-text');
	var currentDate = moment().format('dddd[, ]D MMMM YYYY');
	$(dateElements).html(currentDate);
};

OpenWeatherMap.prototype.getCurrentTimeFromSystem = function() {
	return moment().format('hh:mm[<small>]:ss[</small>]');
};
