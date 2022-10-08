formEl = $('#citySearchForm');
searchInputEl = $('input[name="inputCity"]');
searchBtnEl = document.querySelector("#searchCityBtn");
searchHistoryEl =$('<ul>');
citySearchHistoryDivEl = $('#citySearchHistory');

var searchHistory = [];

function handleCitySearchForm(event) {
  event.preventDefault();

  var inputCity = searchInputEl.val();
  console.log("Input city: " + inputCity);

  if (addCityToSearchHistory(inputCity) == true) {
    displaySearchHistory(inputCity);
  }
  getForecast(inputCity);
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
function displaySearchHistory(inputCity) {
  var liEl = $('<li>');
  var cityBtnEl = $('<button>');

  cityBtnEl.text(inputCity);
  cityBtnEl.addClass("btn btn-primary");
  liEl.append(cityBtnEl);

  liEl.on('click', getForecast);
  searchHistoryEl.append(liEl);
  citySearchHistoryDivEl.append(searchHistoryEl);
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
  var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + "a8f97ddc7ad9ecf69e905ace742d4325";
  fetch(requestUrl)
  .then (function(response){
    console.log("Received response to get current weather conditions");
    response.json().then (function(data){
      console.log("Current Conditions: ");
      console.log(data);
      // display the current conditions
    });
  });
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

formEl.on('submit', handleCitySearchForm);
searchHistoryEl.on('click', handleCityFromHistory);
