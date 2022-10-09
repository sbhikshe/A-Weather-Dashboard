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

var currentDayObj = {
  cityNameEl: undefined,
  dateEl: undefined,
  iconEl: undefined,
  tempEl: undefined,
  windEl: undefined,
  humidityEl: undefined  
};

/* 5 day forecast - DOM elements */
/* Build this the first time, and maintain the references so
we don't need to traverse the DOM everytime? */
var day0 = {
  dayLiEl: undefined,
  dateEl: undefined,
  iconEl: undefined,
  temperatureEl: undefined,
  windEl: undefined,
  humidityEl: undefined
};

var day1 = {
  dayLiEl: undefined,
  dateEl: undefined,
  iconEl: undefined,
  temperatureEl: undefined,
  windEl: undefined,
  humidityEl: undefined
};
var day2 = {
  dayLiEl: undefined,
  dateEl: undefined,
  iconEl: undefined,
  temperatureEl: undefined,
  windEl: undefined,
  humidityEl: undefined
};
var day3 = {
  dayLiEl: undefined,
  dateEl: undefined,
  iconEl: undefined,
  temperatureEl: undefined,
  windEl: undefined,
  humidityEl: undefined
};
var day4 = {
  dayLiEl: undefined,
  dateEl: undefined,
  iconEl: undefined,
  temperatureEl: undefined,
  windEl: undefined,
  humidityEl: undefined
};
var fiveDayForecastObj = [day0, day1, day2, day3, day4];

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

function getForecast(searchCity){
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
      getFiveDayForecast(data.city.coord.lat, data.city.coord.lon);
    });
  });
}

function getCurrentConditions(latitude, longitude) {
  console.log("input City Coordinates : " + latitude, longitude);

  var requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + "a8f97ddc7ad9ecf69e905ace742d4325";
  fetch(requestUrl)
  .then (function(response){
    console.log("Received response to get current weather conditions");
    response.json().then (function(data){
      console.log("Current Conditions: ");
      console.log(data);
      // display the current conditions
      displayCurrentWeather(data);
    });
  });
}

function displayCurrentWeather(data) {
  console.log("displayCurrentWeather");
  var cityName = data.name;
  var momentObj = moment.unix(data.dt);
 
  /* if the elements already exist, just need to set them */
  /* else create and add to the div */
  var divEl = cityWeatherTodayEl.children();
  if (divEl.length === 0) {
    currentDayObj.cityNameEl = $('<h3>');
    cityWeatherTodayEl.append(currentDayObj.cityNameEl);

    currentDayObj.iconEl = $('<img>');
    currentDayObj.cityNameEl.append(currentDayObj.iconEl);

    currentDayObj.dateEl = $('<h3>');
    cityWeatherTodayEl.append(currentDayObj.dateEl);

    currentDayObj.temperatureEl = $('<h5>');
    cityWeatherTodayEl.append(currentDayObj.temperatureEl);

    currentDayObj.windEl = $('<h5>');
    cityWeatherTodayEl.append(currentDayObj.windEl);

    currentDayObj.humidityEl = $('<h5>');
    cityWeatherTodayEl.append(currentDayObj.humidityEl);
  }

  /* set the city name, date, icon, temp, wind, humidity values */
  currentDayObj.cityNameEl.text(data.name + " (" + momentObj.format("MMM D, YYYY") + ")");
  var iconId = data.weather[0].icon;
  currentDayObj.iconEl.attr("src", "http://openweathermap.org/img/w/" + iconId + ".png");
  currentDayObj.cityNameEl.append(currentDayObj.iconEl); // CHECK !!! Why do this again?

  var fahr = ((Number(data.main.temp) - 273.15) * 1.8 + 32).toFixed(0);
  currentDayObj.temperatureEl.text("Temperature: " + fahr + " " + '\u00b0' + "F");
  currentDayObj.windEl.text("Wind speed: " + data.wind.speed + " mph");
  currentDayObj.humidityEl.text("Humidity: " + data.main.humidity + "%");

}

function getFiveDayForecast(latitude, longitude) {
  console.log("getFiveDayForecast");
  console.log("input City Coordinates : " + latitude, longitude);

  //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + "a8f97ddc7ad9ecf69e905ace742d4325";
  fetch(requestUrl)
  .then (function(response){
    console.log("Received response to get 5 day forecast weather");
    response.json().then (function(data){
      console.log("Forecast Conditions: ");
      console.log(data);
      displayFiveDayForecast(data);
    });
  });
}

function displayFiveDayForecast(data) {

  console.log("displayFiveDayForecast: " + data);
 
  /* if the fiveDayForecastUlEl  is empty, create the 5 day DOM and add it to the ul */
  /* also maintain the references in the fiveDayForecastObj array */
  var daysLiEl = fiveDayForecastUlEl.children();
  if (daysLiEl.length === 0) {
    console.log("set up the DOM for the day forecast");
    for ( var i = 0; i < 5; i++) {
      console.log("setting up for day " + i + " forecast");
      fiveDayForecastObj[i].dayLiEl = $('<li>');
      fiveDayForecastObj[i].dayLiEl.addClass("dayForecast");

      fiveDayForecastObj[i].dateEl = $('<h5>');
      fiveDayForecastObj[i].dayLiEl.append(fiveDayForecastObj[i].dateEl);


      fiveDayForecastObj[i].iconEl = $('<img>');
      fiveDayForecastObj[i].dayLiEl.append(fiveDayForecastObj[i].iconEl);

      fiveDayForecastObj[i].temperatureEl = $('<p>');
      fiveDayForecastObj[i].dayLiEl.append(fiveDayForecastObj[i].temperatureEl);

      fiveDayForecastObj[i].windEl = $('<p>');
      fiveDayForecastObj[i].dayLiEl.append(fiveDayForecastObj[i].windEl);

      fiveDayForecastObj[i].humidityEl = $('<p>');
      fiveDayForecastObj[i].dayLiEl.append(fiveDayForecastObj[i].humidityEl);

      fiveDayForecastUlEl.append(fiveDayForecastObj[i].dayLiEl);

      console.log("added day obj to five day object array");
    }
  }
  console.log("The list's children: " + fiveDayForecastUlEl.children().length );
  console.log("The object array: " + fiveDayForecastObj);


  /* set the date, icon, temp, wind, humidity values from the data */
  /* for each of the days */
  /* go through the data */
      var i = 0;
      var prevDateStr = "";

      for (var j = 0; j < data.list.length; j++) {
        var dateStrArr = data.list[j].dt_txt.split(" "); // dt_txt has date and time with " " between
        var date = dateStrArr[0]; // get date only
        console.log("Filling " + i + "prevDateStr: " + prevDateStr + " list[" + j + "]:" + date);

        if (prevDateStr !== date) {
          console.log("Got the next day");
          /* this is an item in the list[] that has the next date */
          /* so, grab the details from this item */
          //day = fiveDayForecastObj[i];
          console.log("Setting " + fiveDayForecastObj[i].dateEl.text());
          fiveDayForecastObj[i].dateEl.text(date);
          console.log("set to " + fiveDayForecastObj[i].dateEl.text());
          fiveDayForecastObj[i].iconEl.attr("src", "http://openweathermap.org/img/w/" + data.list[j].weather[0].icon + ".png");

          var fahr = ((Number(data.list[j].main.temp) - 273.15) * 1.8 + 32).toFixed(0);
          fiveDayForecastObj[i].temperatureEl.text("Temp: " + fahr + " " + '\u00b0' + "F");
          fiveDayForecastObj[i].windEl.text("Wind: " + data.list[j].wind.speed + " mph");
          fiveDayForecastObj[i].humidityEl.text("Humidity: " + data.list[j].main.humidity + "%");

          i++; 
          prevDateStr = date;
        } /* else skip this record, it is for the same day */
        if (i == 5) {
          console.log("Done getting forecast for all days");
          break;
        }
      }
}

function handleCityFromHistory(event) {
  console.log("getForecast for: " + $(event.target));
  var searchCity = $(event.target).text();
  console.log("searchCity = " + searchCity);
  getForecast(searchCity);
}

function showDashboard() {
  /* the form for city search is already displayed */
  /* Pull the cities from the stored search history (if any) and show them now */
  displaySearchHistory();
}

$('document').ready(showDashboard);
formEl.on('submit', handleCitySearchForm);
citySearchHistoryDivEl.on('click', handleCityFromHistory);
