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


let page = 1
let currSearch = ""
let showingCurr = true;

searchForm.addEventListener("submit", getUserInput)
closeBtn.addEventListener("click", clearResults)
moreBtn.addEventListener("click", loadMore)

async function getUserInput(evt){
    evt.preventDefault();
    showingCurr = false
    moviesCurr.innerHTML = ``
    page = 1;
    hideMoreBtn();
    moviesGrid.innerHTML = ``
    
    let input = userInput.value;
    currSearch = input;
    let result = await getResults(input);
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

function showPopup(poster_param){
    console.log("clicked")
    popupElt.classList.remove("hidden")
    console.log(poster_param)
    popupElt.innerHTML = `
        <button id="popup-close-btn" onclick=hidePopup()><i class="material-icons" id="close-icon">close</i></button>
        <img src="https://image.tmdb.org/t/p/w500${poster_param.backdrop_path}"
        alt=${poster_param.original_title} ">
        <p>${poster_param.original_title}</p>
        <p>${poster_param.release_date}</p>
        <p>${poster_param.overview}</p>
    `
    console.log(popupElt.innerHTML)
}

function hidePopup(){
    popupElt.classList.add("hidden")
}

async function displayResults(result_param){
    for(let i = 0; i < result_param.length; i++){  
        let poster = "https://image.tmdb.org/t/p/original"+result_param[i].poster_path
        if(result_param[i].poster_path == null){
            poster = "images/noImage.png"
        }
  showPopup(result_param[i])
        moviesGrid.innerHTML += `
        <div class = "movie-card grid-item">
            <img  onclick=showPopup(${result_param[i]}) class="movie-poster" src=${poster} alt=${result_param[i].original_title} id=${result_param[i].original_title}+"poster">
            <p id = "movie-votes"><span>&#x2B50</span>${result_param[i].vote_average}</p>
            <p id = "movie-title">${result_param[i].original_title}</p>
        </div>
`   
    }   
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
    userInput.value = "";
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
    page = 1;
    showingCurr = true
    hideMoreBtn();
    moviesCurr.innerHTML = `<h2>Now Playing</h2>`
    moviesGrid.innerHTML = ``
    curr_result = await getCurr();
    displayResults(curr_result)
    showMoreBtn();
}

window.onload = function(){
    nowPlaying();
}

