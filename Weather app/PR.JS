const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingscreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
userTab.classList.add("current-tab");
const API_KEY ="f1f5543fb770faf7527bff5af8f09e7a";

function switchTab(clickedTab){
     if(clickedTab != currentTab){
          currentTab.classList.remove("current-tab");
          currentTab = clickedTab;
          currentTab.classList.add("current-tab");

          if(!searchForm.classList.contains("active")){
                    userInfoContainer.classList.remove("active");
                    grantAccessContainer.classList.remove("active");
                    searchForm.classList.add("active");
          }
          else{
                    searchForm.classList.remove("active");
                    //check
                    userInfoContainer.classList.remove("active");
                    //weather your tab madhe aahe  tar weather dkhavya sthi local storage madhle coordinates ghyave lagtil,jar save kela asel tar (coord)
                    getFromSession(); 
          }
     }
     
}

userTab.addEventListener("click",()=>{
          switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
          switchTab(searchTab);
});

function getFromSession(){
     const localCoordinates = sessionStorage.getItem("user-coordinates");
     if(!localCoordinates){
          grantAccessContainer.classList.add("active");
     }
     else{
          const coordinates = JSON.parse(localCoordinates);
          fetchUserWeatherInfo(coordinates);
     }
};

async function fetchUserWeatherInfo(coordinates){
      const {lat,lon} = coordinates;
      grantAccessContainer.classList.remove("active");
      loadingscreen.classList.add("active");

      try{
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
          const data = await response.json();
          loadingscreen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
      }
      catch{
          //
      }
};

function renderWeatherInfo(weatherInfo){
          const cityName = document.querySelector("[data-cityName]");
          const countryIcon = document.querySelector("[data-countryIcon]");
          const desc = document.querySelector("[data-weatherDesc]");
          const weatherIcon = document.querySelector("[data-weatherIcon]");
          const temp = document.querySelector("[data-temp]");
          const windspeed = document.querySelector("[data-windspeed]");
          const humidity = document.querySelector("[data-humidity]");
          const cloudiness = document.querySelector("[data-cloud]");
       
          //fetch values from weatherINfo object and put it UI elements
          cityName.innerText = weatherInfo?.name;
          countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
          desc.innerText = weatherInfo?.weather?.[0]?.description;
          weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
          temp.innerText = weatherInfo?.main?.temp;
          windspeed.innerText = weatherInfo?.wind?.speed;
          humidity.innerText = weatherInfo?.main?.humidity;
          cloudiness.innerText = weatherInfo?.clouds?.all;

};

function showPosition(position){
          const userCordinates = {
             lat: position.coords.latitude,
             lon: position.coords.longitude,
         }
         sessionStorage.setItem("user-coordinates" , JSON.stringify(userCordinates))
         fetchUserWeatherInfo(userCordinates);
       }
       
       //VARCHA functions  jar loacl storage madhi coord astil tar tya sthi lihile
       //current loaction kadhaycha sal tar grant acces cha button vaaprun location kadhava lagal
       const grantAccessButton = document.querySelector("[data-grantAccess]");
       grantAccessButton.addEventListener("click",getLocation);
