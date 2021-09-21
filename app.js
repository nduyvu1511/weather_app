const apiKey = (locations) => `http://api.weatherapi.com/v1/current.json?key=6aad92e31b254bda8df153002211908&q=${locations}&aqi=no`
const LOCAL_NAME = 'weatherKey'
let locations = JSON.parse(localStorage.getItem(LOCAL_NAME)) || 'ho chi minh'

function start() {
    getData()
    getTime()
    getDate()
    document.querySelector('.search-icon').onclick = handleSearch
    document.querySelector('.search-input').onkeypress = (e) => {
        if(e.code === 'Enter') {
            handleSearch()
        }
    }
    searchDraft()
}
start()

async function getData() {
    const response = await fetch(apiKey(locations))
    const data = await response.json()
    console.log(data)
    if(response.status === 200) {
        renderData(data)
    } else {
        renderNotFound(data)
    }
}

function renderData(data) {
    const current = data.current
    const weatherIcons = ['cloudy', 'half-moon', 'rain', 'partlySunny', 'sunny', 'thunder', 'overcast', 'clear']
    let icon = weatherIcons.find(icon => current.condition.text.toLowerCase().lastIndexOf(icon) !== -1)
    const htmls = `
    <div class="temperature">
        <img class="weather-icon" src="../image/${icon}.png" alt="">
        <h3 class="temperature-degree">${current.temp_c} °C</h3>
    </div>
    <div class="others">
        <h3 class="weather-desc">Description: ${current.condition.text}</h3>
        <h3 class="cloud">CLoud: ${current.cloud}</h3>
        <h3 class="uv">UV: ${current.uv}</h3>
        <h3 class="feelslike">Feelslike: ${current.feelslike_c} °C</h3>
    </div>
    `
    document.querySelector('.weather-container').innerHTML = htmls
    let cityName = data.location.name
    cityName = cityName.toLowerCase().includes('city') ? cityName : `${cityName} City`
    document.getElementById('city').textContent = `${cityName}`
    document.getElementById('country').textContent = `${data.location.country}`
}

function handleSearch() {
    locations = document.querySelector('.search-input').value.trim().toLowerCase()
    localStorage.setItem(LOCAL_NAME, JSON.stringify(locations))
    getData()
}

function searchDraft() {
    document.querySelector('.search-input').addEventListener('change', (e) => {
        sessionStorage.setItem('draft', e.target.value)
    })
    document.querySelector('.search-input').value = sessionStorage.getItem('draft')
}

function renderNotFound() {
    alert('City not found')
}

function getTime() {
    const time = new Date()
    let hours = time.getHours()
    let minutes = time.getMinutes()
    let seconds = time.getSeconds()
    let amPm = hours > 12 ? "PM" : "AM"
    hours = hours > 12 ? hours - 12 : hours
    hours = ('0' + hours).slice(-2)
    minutes = ('0' + minutes).slice(-2)
    seconds = ('0' + seconds).slice(-2)
    document.querySelector('.time-output').textContent = `${hours} : ${minutes} : ${seconds} ${amPm}` 
    setTimeout(getTime, 500)

}

function getDate() {
    const time = new Date()
    let date = time.getDate()
    let days = time.getDay()
    let months = time.getMonth() + 1
    months = months < 10 ? `0${months}` : months
    date = date < 10 ? `0${date}` : date
    switch (days) {
        case 2: days = 'Monday'
        break
        case 3: days = 'TuesDay'
        break
        case 4: days = 'Wednesday'
        break
        case 5: days = 'Thursday'
        break
        case 6: days = 'Friday'
        break
        case 7: days = 'Saturday'
        break
        case 8: days = 'Sunday'
        break
    }
    let years = time.getYear()
    console.log(years)
    document.querySelector('.date-output').textContent = `${days}, ${date}/${months}/${1900 + years}` 
}