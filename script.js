// store the value of the input
var city = $("#searchTerm").val();
// store api key
var apiKey = "e7004d59aaee9d2c35310a5585c843a1";

var date = new Date();
// local storage
var historyArr = JSON.parse(localStorage.getItem("history")) || [];

if (historyArr.length > 0) {
}

$("#searchTerm").keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $("#searchBtn").click();
  }
});

function saveToLocal(city) {
  console.log(historyArr);
  if (historyArr.indexOf(city) === -1) {
    historyArr.push(city);
    localStorage.setItem("history", JSON.stringify(historyArr));
  }
}

$("#searchBtn").on("click", function () {
  $("#forecast5day").addClass("show");

  // get the value from user
  city = $("#searchTerm").val();

  historyArr.push(city);
  localStorage.setItem("history", JSON.stringify(historyArr));

  // clear input box
  $("#searchTerm").val("");

  // call api
  var queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  // console.log(queryUrl);
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    var tempF = (response.main.temp - 273.15) * 1.8 + 32;

    getCurrentConditions(response);
    getCurrentForecast(response);
    makeList();
  });
});

//create list for history cities
function makeList() {
  $(".list").empty();
  for (let i = 0; i < historyArr.length; i++) {
    var listItem = $("<li>").addClass("list-group-item").text(historyArr[i]);
    $(".list").append(listItem);
  }
}
//call function to clear page
makeList();

$(".list").on("click", ".list-group-item", function () {
  $("#forecast5day").addClass("show");

  // get the value from user
  city = $(this).text();

  // call api
  var queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  // console.log(queryUrl);
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    var tempF = (response.main.temp - 273.15) * 1.8 + 32;

    getCurrentConditions(response);
    getCurrentForecast(response);
  });
});

function getCurrentConditions(response) {
  // get the temperature and convert to fahrenheit >> is there a better way?
  var tempF = (response.main.temp - 273.15) * 1.8 + 32;
  tempF = Math.floor(tempF);

  $("#currentCity").empty();

  // get and set the content
  var card = $("<div>").addClass("card");
  var cardBody = $("<div>").addClass("card-body");
  var city = $("<h4>").addClass("card-title").text(response.name);
  var cityDate = $("<h4>")
    .addClass("card-title")
    .text(date.toLocaleDateString("en-US"));
  var temperature = $("<p>")
    .addClass("card-text current-temp")
    .text("Temperature: " + tempF + " °F");
  var humidity = $("<p>")
    .addClass("card-text current-humidity")
    .text("Humidity: " + response.main.humidity + "%");
  var wind = $("<p>")
    .addClass("card-text current-wind")
    .text("Wind Speed: " + response.wind.speed + " MPH");
  var image = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
  );

  // append
  city.append(cityDate, image);
  cardBody.append(city, temperature, humidity, wind);
  card.append(cardBody);
  $("#currentCity").append(card);
}

function getCurrentForecast() {
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      apiKey,
    method: "GET",
  }).then(function (response) {
    $("#forecast").empty();

    // variable to hold response.list
    var results = response.list;

    for (let i = 0; i < results.length; i++) {
      var day = Number(results[i].dt_txt.split("-")[2].split(" ")[0]);
      var hour = results[i].dt_txt.split("-")[2].split(" ")[1];

      if (results[i].dt_txt.indexOf("12:00:00") !== -1) {
        // get the temperature and convert to fahrenheit
        var temp = (results[i].main.temp - 273.15) * 1.8 + 32;
        var tempF = Math.floor(temp);

        var card = $("<div>").addClass(
          "card col-md-2 ml-4 bg-primary text-white"
        );
        var cardBody = $("<div>").addClass("card-body p-3 forecastBody");
        var cityDate = $("<h4>")
          .addClass("card-title")
          .text(date.toLocaleDateString("en-US"));
        var temperature = $("<p>")
          .addClass("card-text forecastTemp")
          .text("Temperature: " + tempF + " °F");
        var humidity = $("<p>")
          .addClass("card-text forecastHumidity")
          .text("Humidity: " + results[i].main.humidity + "%");

        var image = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/w/" +
            results[i].weather[0].icon +
            ".png"
        );

        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);
      }
    }
  });
}
