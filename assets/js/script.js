	var tempUnit = 'f';
	var tempToday;
	var	weatherData;

$(document).ready(function() {

// Detect location
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(locationSuccess,locationFail);
	}else{
		$('#error').removeClass('hidden');
		$('#error').text('Uh oh,your browser does not support geolocation.');
	}

	function locationFail(){
		var msg = 'Please turn Geolocation on.';
		$('#error').removeClass('hidden').text(msg);
	}

	function locationSuccess(position){

		//for the weather info
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var weatherAPI='http://api.openweathermap.org/data/2.5/forecast/daily?lat='+ lat +'&lon='+ lon +'&cnt=6&units=imperial' + '&APPID=be761b44747b2ed24a91d494de31c45c';
		//for the bg image
		var maxLat = lat + 0.089982311915998;
		var maxLon = lon + 0.089982311915998
		var imgAPI = 'http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=20&minx='+ lon +'&miny='+ lat +'&maxx='+ maxLon + '&maxy='+ maxLat +'&size=original&callback=?'
		console.log(weatherAPI);

//parse JSON

		$.getJSON(weatherAPI)
		  .fail(function(){
		  	var msg = 'Sorry, something went wrong';
		  	$('#error').removeClass('hidden').text(msg);
		  	console.log('JSON file not loaded');
		  })
		  .done(function(data){
		  	weatherData = data;


				//add current conditions

		  	var today = data.list[0].dt;
		  	tempToday = Math.round(data.list[0].temp.day);
		  	var icon = data.list[0].weather[0].id;
		  	var city = data.city.name;
		  	var date = moment(today * 1000).format('MMMM DD, YYYY');

		  	var todayConditions = '<i class="owf owf-' + icon + ' owf-5x owf-pull-left"></i>' +
								  '<h3>' + city + '</h3>' +
								  '<p>' + date + '</p>';

		  	$('#today').append(todayConditions);
		  	$('#temp').text(tempToday + '°');

				//add 5-day forecast data to mustache template

			data.formatDate = function(){
				return moment(this.dt*1000).format('ddd, MMM DD');
			};

			data.formatTemp = function(){
					return (Math.round(this.temp.day) + '°');
			};

			data.iconClass = function(){
				var iconId = this.weather[0].id;
				//var className = 'class="owf' + ' owf-'+ iconId +' owf-2x"';
				return ('owf owf-'+ iconId + ' owf-2x');
			};

			var tlContent = $('#forecastTemplate').html();
			var rendForecast = Mustache.render(tlContent,data);
			$('#forecast').html(rendForecast);

			//Buttons

			$('#cel').click(function(){
				changeTemp('cel');
			});

			$('#far').click(function(){
				changeTemp('far');
			});

		  }); //parse JSON done

			//get bg image
			$.getJSON(imgAPI)
				.fail(function(){
					console.log('failed loading images');
					$(document.body).attr('style','background-image: url("/assets/img/daytime.jpeg")');
				})
				.done(function(data){
					var imgagesArr = data.photos;
					console.log(imgagesArr);
					var i = Math.floor(Math.random() * 21);
					var bgImage = data.photos[i].photo_file_url;
					var photoUrl = data.photos[i].photo_url;
					console.log(bgImage);
					$(document.body).attr('style','background-image: url("'+ bgImage +'")');
					$('#photoCredit').attr('href', photoUrl);
				})

	} //location success

}); // document ready

function changeTemp(unit){
var originalTemp = Math.round(weatherData.list[0].temp.day);
	if (unit == 'cel' && tempUnit == 'f'){
		//converts the main temperature
		tempToday = Math.round((originalTemp - 32)/1.8);
		$('#temp').html(tempToday + '°');

		// reload template with converted temperature values
		reloadTemplate();
		tempUnit = 'c';

	}else if(unit == 'far' && tempUnit == 'c'){
		tempToday = originalTemp;
		$('#temp').text(tempToday + '°');
		reloadTemplate();
		tempUnit = 'f';
	}
}

function reloadTemplate(){

	weatherData.formatDate = function(){
		return moment(this.dt*1000).format('ddd, MMM DD');
	};

	weatherData.formatTemp = function(){
		if (tempUnit == 'f'){
			return (Math.round((this.temp.day - 32)/1.8) + '°');
		} else if (tempUnit == 'c'){
			return (Math.round(this.temp.day) + '°');
		}
	};

	weatherData.iconClass = function(){
		var iconId = this.weather[0].id;
		//var className = 'class="owf' + ' owf-'+ iconId +' owf-2x"';
		return ('owf owf-'+ iconId + ' owf-2x');
	};

	var tlContent = $('#forecastTemplate').html();
	var rendForecast = Mustache.render(tlContent,weatherData);
	$('#forecast').html(rendForecast);
}
