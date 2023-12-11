
function GetInfo() {
    var newName = document.getElementById("cityInput");
    var cityName = document.getElementById("cityName");
    cityName.innerHTML = newName.value;

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + newName.value + '&appid=a2008d721dfb99aa5b57b3f41d956810')
        .then(response => response.json())
        .then(data => {
            // Getting the min and max values for each day
            for (let i = 0; i < 5; i++) {
                // Convert Kelvin to Celsius and then to Fahrenheit
                const minTempF = (data.list[i].main.temp_min - 273.15) * 9/5 + 32;
                const maxTempF = (data.list[i].main.temp_max - 273.15) * 9/5 + 32;
                const humidity = data.list[i].main.humidity;
                const wind = data.list[i].wind.speed;


             // Save the current search as a previous search
                savePreviousSearch(newName.value);

                // Add the current date
                const currentDate = new Date();
                document.getElementById("currentDate").innerHTML = "Current Date: " + currentDate.toDateString();

                // Add the date for each day
                const forecastDate = new Date(data.list[i].dt * 1000); // Convert timestamp to milliseconds
                document.getElementById("day" + (i + 1)).innerHTML = ` ${forecastDate.toDateString()}`;
                
                document.getElementById("day" + (i + 1) + "Min").innerHTML = "Min: " + minTempF.toFixed(1) + "°";
                document.getElementById("day" + (i + 1) + "Max").innerHTML = "Max: " + maxTempF.toFixed(2) + "°";
                document.getElementById("day" + (i + 1) + "humidity").innerHTML = "Humidity: " + humidity + "%";
                document.getElementById("day" + (i + 1) + "wind").innerHTML = "Wind: " + wind + " m/s";
            }

            
            //Getting Weather Icons
             for(i = 0; i<5; i++){
                document.getElementById("img" + (i+1)).src = "http://openweathermap.org/img/wn/"+
                data.list[i].weather[0].icon
                +".png";
            }
        
            console.log(data)
        })
        .catch(err => alert("Something Went Wrong: Try Checking Your Internet Connection"));
    }

    // Display previous searches when the page loads
    displayPreviousSearches();


function DefaultScreen(){
    document.getElementById("cityInput").defaultValue = "Los Angeles";
    GetInfo();
}

//Getting and displaying the text for the upcoming five days of the week
var d = new Date();
var weekday = [];

//Function to get the correct integer for the index of the days array
function CheckDay(day){
    if(day + d.getDay() > 6){
        return day + d.getDay() - 7;
    }
    else{
        return day + d.getDay();
    }
}

    for(i = 0; i<5; i++){
        document.getElementById("day" + (i+1)).innerHTML = weekday[CheckDay(i)];
    }





    // Function to handle a click on a previous city search
function handlePreviousSearch(cityName) {
    // Set the input field to the clicked city name
    document.getElementById("cityInput").value = cityName;
    // Trigger the weather fetch for the clicked city
    GetInfo();
}

// Function to display the list of previous city searches
function displayPreviousSearches() {
    // Get the previous searches from local storage
    const previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

    // Get the element where you want to display the previous searches
    const prevSearchElement = document.getElementById("prevSearch");

    // Clear previous searches
    prevSearchElement.innerHTML = "";

    // Loop through previous searches and create HTML elements
    previousSearches.forEach(cityName => {
        const searchItem = document.createElement("div");
        searchItem.textContent = cityName;
        // Add a click event listener to trigger the weather fetch for the clicked city
        searchItem.addEventListener("click", () => handlePreviousSearch(cityName));
        prevSearchElement.appendChild(searchItem);
    });
}


// Function to save the current search as a previous search
function savePreviousSearch(cityName) {
    // Get the previous searches from local storage
    const previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

    // Check if the current search already exists in the list
    if (!previousSearches.includes(cityName)) {
        // Add the current search to the list
        previousSearches.push(cityName);

        // Save the updated list back to local storage
        localStorage.setItem("previousSearches", JSON.stringify(previousSearches));

        // Display the updated list
        displayPreviousSearches();
    }
}
