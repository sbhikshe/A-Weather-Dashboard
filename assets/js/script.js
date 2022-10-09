/* inside col-2 container */
formEl = $('#citySearchForm');
searchInputEl = $('input[name="inputCity"]');
searchBtnEl = document.querySelector("#searchCityBtn");
searchHistoryUlEl =$('<ul>');
citySearchHistoryDivEl = $('#citySearchHistory');

/* inside col-10 container */
var cityWeatherTodayEl = $('#cityWeatherToday'); // div
var fiveDayForecastUlEl = $('#fiveDayForecast'); // ul

var searchHistory = [];

function handleCitySearchForm(event) {
  event.preventDefault();

  var inputCity = searchInputEl.val();
  console.log("Input city: " + inputCity);

  if(inputCity != ""){
    if (addCityToSearchHistory(inputCity) == true) {
      displaySearchHistory();
    }
    getForecast(inputCity);
  }
}

function addCityToSearchHistory(inputCity) {

  var tmp = JSON.parse(localStorage.getItem("searchHistory"));
  if(!tmp) {
      searchHistory.push(inputCity);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      addCityToSearchHistory(inputCity);
  } else {
    searchHistory = tmp;
    var found = false;
    for (var i = 0; i < searchHistory.length; i++) {
      if(searchHistory[i] == inputCity) {
        return false;
      }
    }
    if(!found) {
      searchHistory.push(inputCity);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      addCityToSearchHistory(inputCity);
    }
  }
  return true;
}
function displaySearchHistory() {
  var liEl;
  var cityBtnEl;
  var searchHistoryUlEl;

  console.log("in displaySearchHistory()");

  /* get search history from local storage */
  var tmp = JSON.parse(localStorage.getItem("searchHistory"));
  /* if there is one, then show the cities, else return right away */
  if (tmp) {
    /* not empty, iterate through it and show the cities */
    console.log("Search history exists in local storage");
    searchHistory = tmp;
    searchHistoryUlEl =$('<ul>');

    for (var i = 0; i < searchHistory.length; i++){
      /* set up the button with the city name */
      /* add it to the li element */
      console.log("City " + i + ": " + searchHistory[i]);
      liEl = $('<li>');
      cityBtnEl = $('<button>');
      cityBtnEl.text(searchHistory[i]);
      cityBtnEl.addClass("btn btn-primary");
      liEl.append(cityBtnEl);
  
      //liEl.on('click', getForecast); - required? there is a listener on the ul?
      /* attach the list item to the list */
      searchHistoryUlEl.append(liEl);
    }
    /* if there is already an ul attached to the div, remove that
    before adding this new ul */
    /* attach the list to the city search history div */
    if(citySearchHistoryDivEl.children($('ul'))){
      console.log("Removing existing ul and attaching new one")
      citySearchHistoryDivEl.empty();
    }
    citySearchHistoryDivEl.append(searchHistoryUlEl);
  } else {
    console.log("No search history");
  }
}

function getCityCoordinates(searchCity){
  /* get latitude and longitude for the input city */
  //api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
  var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + "a8f97ddc7ad9ecf69e905ace742d4325";

  fetch(requestUrl)
  .then (function(response) {
    console.log("Received response to get coords request");
    response.json().then(function(data) {
      /* get the latitude, longitude */
      console.log(data);
      console.log("latitude " + data.city.coord.lat + ", longitude: " + data.city.coord.lon);
      getCurrentConditions(data.city.coord.lat, data.city.coord.lon);
    });
  });
}

function getCurrentConditions(latitude, longitude) {
  console.log("input City Coordinates : " + latitude, longitude);

  //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  var requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + "a8f97ddc7ad9ecf69e905ace742d4325";

  //var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + "a8f97ddc7ad9ecf69e905ace742d4325";
  fetch(requestUrl)
  .then (function(response){
    console.log("Received response to get current weather conditions");
    response.json().then (function(data){
      console.log("Current Conditions: ");
      console.log(data);
      // display the current conditions
      displayCurrentWeather(data);
      //console.log("Response city name: " + data.name);
    });
  });
}

function displayCurrentWeather(data) {
  console.log("displayCurrentWeather");
  var cityName = data.name;
  var momentObj = moment.unix(data.dt);
  console.log("city = " + cityName + " date = " + momentObj.format("D MMM YYYY"));
  console.log("temp: " + data.main.temp);
  console.log("wind: " + data.wind.speed);
  console.log("humidity: " + data.main.humidity + "%");

  var selectedCityEl;
  var iconEl;
  var temperatureEl;
  var windEl;
  var humidityEl;
 
  /* if the elements already exist, just need to set them */
  /* else create and add to the div */
  var divEl = cityWeatherTodayEl.children();
  if (divEl.length > 0) {
    selectedCityEl = divEl.eq(0);
    iconEl = selectedCityEl.children().eq(0);
    temperatureEl = divEl.eq(2);
    windEl = divEl.eq(3);
    humidityEl = divEl.eq(4);
  } else {
    selectedCityEl = $('<h3>');
    cityWeatherTodayEl.append(selectedCityEl);

    iconEl = $('<img>');
    selectedCityEl.append(iconEl);

    dateEl = $('<h3>');
    cityWeatherTodayEl.append(dateEl);

    temperatureEl = $('<h5>');
    cityWeatherTodayEl.append(temperatureEl);

    windEl = $('<h5>');
    cityWeatherTodayEl.append(windEl);

    humidityEl = $('<h5>');
    cityWeatherTodayEl.append(humidityEl);
  }

  /* set the city name, date, temp, wind, humidity values */
  selectedCityEl.text(data.name + " (" + momentObj.format("MMM D, YYYY") + ")");
  var iconId = data.weather[0].icon;
  iconEl.attr("src", "http://openweathermap.org/img/w/" + iconId + ".png");
  selectedCityEl.append(iconEl);

  var fahr = ((Number(data.main.temp) - 273.15) * 1.8 + 32).toFixed(0);
  temperatureEl.text("Temperature: " + fahr + " " + '\u00b0' + "F");
  windEl.text("Wind speed: " + data.wind.speed + " mph");
  humidityEl.text("Humidity: " + data.main.humidity + "%");

}

function getForecast(searchCity) {

  /* form search request for the city */
  /* get latitude and longitude for the input city */
  getCityCoordinates(searchCity);

  /* get current forecast / 5 day forecast */
  /* handle response */
  /* display current weather conditions */
  /* display future weather conditions */

}

function handleCityFromHistory(event) {
  console.log("getForecast for: " + $(event.target));
  var searchCity = $(event.target).text();
  console.log("searchCity = " + searchCity);
  getForecast(searchCity);
}

function showDashboard() {
  /* the form for city search is already displayed */
  /* we want to pull the cities from the stored  search history (if any) and show that now */
  displaySearchHistory();
}

$('document').ready(showDashboard);
formEl.on('submit', handleCitySearchForm);
citySearchHistoryDivEl.on('click', handleCityFromHistory);
