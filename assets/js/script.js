formEl = $('#citySearchForm');
searchInputEl = $('input[name="inputCity"]');
searchBtnEl = document.querySelector("#searchCityBtn");
searchHistoryEl =$('<ul>');
citySearchHistoryDivEl = $('#citySearchHistory');

var searchHistory = [];

function lookupWeather(event) {
  event.preventDefault();

  var inputCity = searchInputEl.val();
  console.log("Input city: " + inputCity);

  if (addCityToSearchHistory(inputCity) == true) {
    displaySearchHistory(inputCity);
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

function getForecast(event) {
  console.log("getForecast for: " + event.target);
}

formEl.on('submit', lookupWeather);