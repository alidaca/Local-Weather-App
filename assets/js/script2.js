
$(document).ready(function() {

	var tempUnit = 'f';
	var tempToday;
	var	weatherData;


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
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var weatherAPI='http://api.openweathermap.org/data/2.5/forecast/daily?lat='+ lat +'&lon='+ lon +'&cnt=6&units=imperial';

		console.log(weatherAPI);

//parse JSON

		$.getJSON(weatherAPI)
		  .fail(function(){
		  	var msg = 'Sorry, something went wrong';
		  	$('#error').removeClass('hidden').text(msg);
		  })
		  .done(function(data){
		  	weatherData = data;
		  	console.log(weatherData.list[1].temp.day);
		  	console.log(data);

//add current conditions

		  	var today = data.list[0].dt;
		  	tempToday = Math.round(data.list[0].temp.day);
		  	var icon = data.list[0].weather[0].id;
		  	var city = data.city.name;
		  	var date = moment(today * 1000).format('MMMM DD, YYYY');
		  	console.log(icon);

		  	var todayConditions = '<i class="owf owf-' + icon + ' owf-5x owf-pull-left"></i>' +
						'<h3>' + city + '</h3>' + 
						'<p>' + date + '</p>';
		  	
		  	$('#today').append(todayConditions);
		  	$('#temp').text(tempToday + '°');

//add 5-day forecast data

		  	$.each(data.list, function(){
		  		if ((this.dt) !== (today)){
		  			var dayOfWeek = moment(this.dt*1000).format('ddd, MMM DD');
		  			var iconId = this.weather[0].id;
		  			var tempDay = Math.round(this.temp.day);
		  			console.log(this.weather[0].id);
		  			var forecast = '<div class="row forecastRow">'+
								   '<div class="col-md-6">' + dayOfWeek + '</div>' +
								   '<div class="col-md-3">' + tempDay + '&ordm;</div>' +
								   '<div class="col-md-3"><i class="owf owf-' + iconId + ' owf-2x"</i></div>' +
								   '</div>';
		  			$('#forecast').append(forecast);
		  		}	
		  	}); // forecast loop
		  }); //parse JSON done
	} //location success

	//Buttons

	$('#far').on('click', function(){ //restores temperature to farenheit
			tempToday = Math.round(weatherData.list[0].temp.day);
			$('#temp').text(tempToday + '°');
			// $('#cel').removeClass('fade');
			// $('#far').addClass('fade');
			var newMarkup = '';
			$.each(weatherData.list, function(){
		  		if ((this.dt) !== (today)){
		  			var dayOfWeek = moment(this.dt*1000).format('ddd, MMM DD');
		  			var iconId = this.weather[0].id;
		  			var tempDay = Math.round(this.temp.day);
		  			console.log(this.weather[0].id);
		  			var forecast = '<div class="row forecastRow">'+
		  						  '<div class="col-md-6">' + dayOfWeek + '</div>' +
								  '<div class="col-md-3">' + tempDay + '&ordm;</div>' +
								  '<div class="col-md-3"><i class="owf owf-' + iconId + ' owf-2x"</i></div>' +
								  '</div>';
		  			newMarkup += forecast;
		  			console.log(newMarkup);
		  		}
		  	$('#forecast').html(newMarkup);
					//tempUnit = 'c';
			});
	});

	$('#cel').on('click', function(){	 //converts to celsius
			tempToday = Math.round((tempToday- 32) /1.8);
			$('#temp').text(tempToday + '°');
			// $('#far').removeClass('fade');
			// $('#cel').addClass('fade');
			var newMarkup ='';			
			$.each(weatherData.list, function(){
				if ((this.dt) !== (today)){
					var tempDay = Math.round((this.temp.day - 32)/1.8);
					var dayOfWeek = moment(t
		  			var iconId = this.weather[0].id;
					$('.tempDay').text(tempDay + '°');
					var forecast = '<div class="row forecastRow">'+
								   '<div class="col-md-6">' + dayOfWeek + '</div>' +
								   '<div class="col-md-3">' + tempDay + '&ordm;</div>' +
								   '<div class="col-md-3"><i class="owf owf-' + iconId + ' owf-2x"</i></div>' +
								   '</div>';
					newMarkup += forecast;
					console.log(newMarkup);
		  		}
		  	$('#forecast').html(newMarkup);
			});
			//tempUnit = 'f';
	});

	// var forecastMarkup = '<div class="row forecastRow">'+
	// 				     '<div class="col-md-6">' + dayOfWeek + '</div>' +
	// 				     '<div class="col-md-3">' + tempDay + '&ordm;</div>' +
	// 				     '<div class="col-md-3"><i class="owf owf-' + iconId + ' owf-2x"</i></div>' +
	// 				     '</div>';	
}); // document ready


	

