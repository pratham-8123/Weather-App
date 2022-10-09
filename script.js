const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
arrowBack = wrapper.querySelector("header i"),
weatherWrapper = wrapper.querySelector('.weather-wrapper');

let weatherPart = wrapper.querySelector(".weather-part");
let wIcon = weatherPart.querySelector("img");

let api, currDate;
let originalWeatherPart= weatherPart.cloneNode(true);

let alldates = new Set();

setTimeout(()=>{
    // web page entry style
    document.querySelector('.entry').style.display='none';
    wrapper.classList.add('show');
},3000);


inputField.addEventListener("keyup", e =>{
    // if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=80a2b8836cfe1d58e33d4aa9a7b1f5d4`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=80a2b8836cfe1d58e33d4aa9a7b1f5d4`;
    fetchData();
}



function onError(error){
    // if any error occur while getting user location then we'll show it in infoText
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function  fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another 
    // then function calling weatherDetails function with passing api result as an argument
   setTimeout(async()=>{
    try{
        let res= await fetch(api);
        let data = await res.json();
        weatherDetails(data);
       }catch(error){
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
       }
   },1000);
    
};

let d;
function weatherDetails(info){


    if(info.cod == "404"){ // if user entered city name isn't valid
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        //getting required properties value from the whole weather information
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        const {lat,lon}=info.coord;
        // console.log(`${id} and ${description}`);
        // using custom weather icon according to the id which api gives to us
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        let date = new Date();
        currDate= `${date.getFullYear()}-${date.getMonth()+1}-`;
        
        if(date.getDate()<10) currDate+= '0'+date.getDate();
        d = currDate;
        alldates.add(currDate);
        document.getElementById('date').innerText= currDate;

        //passing a particular weather info to a particular element
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
        nxtForecastbtn.addEventListener("click",()=>{
            console.log("hello");
            api=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=80a2b8836cfe1d58e33d4aa9a7b1f5d4`
            fetchNxtForecast();
        });
    }
}

async function fetchNxtForecast(){
      try{
          let res=await fetch(api);
          let data=await res.json();
          showForecast(data);

      }catch{
          
      }
}

function showForecast(info){

    wrapper.classList.add('future-wrapper');
    weatherPart.classList.add('future-weather');
    // hide button
    weatherPart.querySelector('#nxtForecastbtn').classList.add('hide-button');
// originalWeatherPart= weatherPart.cloneNode(true);

    for(var i in info.list){
        currDate = info.list[i].dt_txt.split(' ')[0];
        console.log(`${currDate} and ${d}`);
        if(currDate === d) continue;
        if(alldates.has(currDate)) continue;
        
        alldates.add(currDate);
        let clonedWeather = weatherPart.cloneNode(true);
        clonedWeather.id = `cloned-${i}`;

        // change data before appending
        const id = info.list[i].weather[0].id;
        
        const {temp, feels_like, temp_min, temp_max, humidity} = info.list[i].main;
        const description = info.list[i].weather[0].description;
        // console.log(`${id} and ${description}`);
        // using custom weather icon according to the id which api gives to us
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        //passing a particular weather info.list[i] to a particular element
        clonedWeather.querySelector(".weather").innerText = description;
        clonedWeather.querySelector("#date").innerText= currDate;
        clonedWeather.querySelector(".temp .numb").innerText = Math.floor(temp-273);
        clonedWeather.querySelector(".temp .numb-2").innerText = Math.floor(feels_like-273);
        clonedWeather.querySelector(".humidity span").innerText = `${humidity}%`;

        weatherWrapper.appendChild(clonedWeather);
        console.log(`Date:${info.list[i].dt_txt} Temp-Min:${Math.floor(info.list[i].main.temp_min)-273} Temp-Max:${Math.floor(info.list[i].main.temp_max)-273}<br><br>`)
    }

}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    wrapper.classList.remove("future-wrapper");
    let cards = document.getElementsByClassName('weather-part');
    for(let i= cards.length-1; i>=0; i--)
        cards[i].parentNode.removeChild(cards[i]);

    
    alldates.clear();
    weatherPart= originalWeatherPart;
    wIcon = weatherPart.querySelector("img");
    originalWeatherPart= weatherPart.cloneNode(true);
    weatherWrapper.appendChild(weatherPart);
});
