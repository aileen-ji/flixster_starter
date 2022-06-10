//global variables
const API_KEY = "3d8343d2b19e12933d9a7428dc01db59"

let moviesGrid = document.getElementById("movies-grid")
let moviesCard = document.getElementsByClassName("movie-card")
let searchForm = document.querySelector("form")
let userInput = document.getElementById("search-input")
let searchBtn = document.getElementById("search-btn")
let closeBtn = document.getElementById("close-search-btn")
let moreBtn = document.getElementById("load-more-movies-btn")
let moviesCurr = document.querySelector("#now-in")
let popupElt = document.getElementById("popup-div")
let dayNight = document.getElementById("switch-mode")
let dayBtn = document.getElementById("day")
let nightBtn = document.getElementById("night")

let page = 1
let currSearch = ""
let showingCurr = true;

searchForm.addEventListener("submit", getUserInput)
closeBtn.addEventListener("click", clearResults)
moreBtn.addEventListener("click", loadMore)
dayNight.addEventListener("click", switchMode)

async function getUserInput(evt){
    evt.preventDefault();
    showingCurr = false
    moviesCurr.innerHTML = ``
    page = 1;
    hideMoreBtn();
    moviesGrid.innerHTML = ``
    
    let input = userInput.value;
    if(input == null){
        return;
    }
    currSearch = input;
    let result = await getResults(input);
    if(result.length == 0){
        alert("No results")
        clearResults()
    }
    displayResults(result)
    userInput.value = ""
    showMoreBtn();
}

async function getResults(input){
    let apiUrl = "https://api.themoviedb.org/3/search/movie?api_key="+API_KEY+"&query="+input+"&page="+page;
    let response = await fetch(apiUrl);
    let responseData = await response.json();
    return responseData.results;
}



function hidePopup(){
    popupElt.classList.add("hidden")
}



function displayResults(resultparam){
    for(let i = 0; i < resultparam.length; i++){  
        let poster = "https://image.tmdb.org/t/p/w500/"+resultparam[i].poster_path
        if(resultparam[i].poster_path == null){
            poster = "images/noImage.png"
        }
        
        //console.log(resultparam[i]);
        moviesGrid.innerHTML += `
        <div class = "movie-card grid-item">
            <img  class="movie-poster" src=${poster} alt=${resultparam[i].original_title} id=${i}>
            <p id = "movie-votes"><span>&#x2B50</span>${resultparam[i].vote_average}</p>
            <p id = "movie-title">${resultparam[i].original_title}</p>
        </div>
`   
    
    }
    var posters = document.getElementsByClassName("movie-poster")  
    for(let j = 0; j < resultparam.length; j++){
        posters[j].addEventListener('click', myfunc, false);
        posters[j].myParam = resultparam[j];
    }
    
}

function myfunc(evt){
    evt.preventDefault()
    showPopup(evt.target.myParam);
}

async function showPopup(poster_param){
    let video = "https://api.themoviedb.org/3/movie/"+poster_param.id+"/videos?api_key="+API_KEY
    let videoresponse = await fetch(video);
    let videoresponseData = await videoresponse.json();
    let link; 
    if(videoresponseData.results.length == 0){
        link = "images/noImage.png"
    }
    else{
        link = "https://www.youtube.com/embed/"+videoresponseData.results[0].key
    }
    console.log(link)
    popupElt.classList.remove("hidden")
    popupElt.innerHTML = `
    <div class = "popup-top">    
    <button id="popup-close-btn" onclick=hidePopup()><i class="material-icons" id="close-icon">close</i></button>
         <p class="original-title">${poster_param.original_title}</p>
         </div>
         <iframe src=${link}></iframe>
         <img src="https://image.tmdb.org/t/p/original${poster_param.backdrop_path}"
        alt=${poster_param.original_title} " class ="backdrop">
        <p>${poster_param.release_date} | <span>&#x2B50</span>${poster_param.vote_average} | ${poster_param.original_language.toUpperCase()}</p>
        <p>${poster_param.overview}</p>
    `
    console.log(popupElt.innerHTML)
}

function testAlert(poster_param){
    console.log(poster_param);
}

async function loadMore(){
    page += 1;
    let more_result;
    if(showingCurr){
        more_result = await getCurr()
    }
    else{
        more_result = await getResults(currSearch);
    }
    displayResults(more_result);
}


function hideMoreBtn(){
    if(!moreBtn.classList.contains("hidden")){
        moreBtn.classList.add("hidden")
    }
}

function showMoreBtn(){
    if(moreBtn.classList.contains("hidden")){
        moreBtn.classList.remove("hidden")
    }
}

function clearResults(){
    console.log("cleared")
    userInput.value = ""
    moviesGrid.innerHTML = ``
    currSearch = ""
    nowPlaying();
}

async function getCurr(){
    let currUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key="+API_KEY+"&page="+page+"&include_adult=false";
    let response = await fetch(currUrl);
    let responseData = await response.json();
    return responseData.results;
}

async function nowPlaying(){
    console.log("playing")
    page = 1;
    showingCurr = true
    hideMoreBtn();
    
    moviesGrid.innerHTML = ``
    curr_result = await getCurr();
    console.log("got")
    displayResults(curr_result)
    moviesCurr.innerHTML = `<h2>Now playing</h2>`
    showMoreBtn();
}

function switchMode(){
    if(nightBtn.classList.contains("hidden")){
        nightBtn.classList.remove("hidden")
        dayBtn.classList.add("hidden")
        var element = document.body;
        element.classList.toggle("dark-mode");
    }
    else{
        dayBtn.classList.remove("hidden")
        nightBtn.classList.add("hidden")
        var element = document.body;
        element.classList.remove("dark-mode");
    }
}

window.onload = function(){
    nowPlaying();
}

