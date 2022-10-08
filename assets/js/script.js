formEl = $('#citySearchForm');
searchInputEl = $('input[name="inputCity"]');
searchBtnEl = document.querySelector("#searchCityBtn");
searchHistoryUlEl =$('<ul>');
citySearchHistoryDivEl = $('#citySearchHistory');

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

function showDashboard() {
  /* the form for city search is already displayed */
  /* we want to pull the cities from the stored  search history (if any) and show that now */
  displaySearchHistory();
}

$('document').ready(showDashboard);
formEl.on('submit', handleCitySearchForm);
citySearchHistoryDivEl.on('click', handleCityFromHistory);
