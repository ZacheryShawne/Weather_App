import { forecastByCityState } from '../api'
import { kToF, mphToKph, timeConversion } from '../utils/conversions'
import { convertBtn } from './/searchbar'

// Load dom with search data
async function callDisplays(x, city) {
  const data = await forecastByCityState(x)
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  }
  const container = document.querySelector('#root')
  removeAllChildNodes(container)
  await current(data, city)
  await hourly(data)
  await daily(data)
}

// Load dom with default city 'Wilmington' on page load
async function defaultDisplay(x, city) {
  const data = await forecastByCityState(x)
  await current(data, city)
  await hourly(data)
  await daily(data)
}

async function current(data, city) {
  const app = document.querySelector('#root')

  const wrapper = document.createElement('div')
  wrapper.classList.add('header-wrapper')

  const cityName = document.createElement('span')
  cityName.classList.add('city')
  cityName.textContent = `${city}`

  const temp = document.createElement('span')
  temp.classList.add('current-temp', 'temp')
  temp.textContent = `${kToF(data.current.temp)}`

  const wind = document.createElement('span')
  wind.classList.add('current-wind')
  wind.textContent = `Winds: ${mphToKph(data.current.wind_speed)}`

  const weatherDescription = document.createElement('span')
  weatherDescription.classList.add('current-weather-description')
  weatherDescription.textContent = `${data.current.weather[0].description}`

  const humidity = document.createElement('span')
  humidity.classList.add('current-humidity')
  humidity.textContent = `Humidity: ${data.current.humidity}%`

  const clouds = document.createElement('span')
  clouds.classList.add('current-clouds')
  clouds.textContent = `Cloudy: ${data.current.clouds}%`

  const feelsLike = document.createElement('span')
  feelsLike.classList.add('current-feels-like')
  feelsLike.textContent = `Feels like: ${kToF(data.current.feels_like)}`

  const pressure = document.createElement('span')
  pressure.classList.add('current-pressure')
  pressure.textContent = `${data.current.pressure}hPa`

  const currentTime = document.createElement('span')
  currentTime.classList.add('current-time')
  console.log(data.current.dt)
  const myDate = new Date(data.current.dt * 1000)
  console.log(myDate)
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'America/New_York',
  }
  currentTime.textContent = `${new Intl.DateTimeFormat('en-US', options).format(myDate)}`

  // const weatherMain = document.createElement('span')
  // weatherMain.classList.add('current-weather')
  // weatherMain.textContent = `It is currently ${data.current.weather[0].main} outside`

  // const weatherIcon = document.createElement('img')
  // weatherIcon.classList.add('current-weather-icon')
  // weatherIcon.src = iconUrl(data.current.weather[0].icon)

  wrapper.append(
    cityName,
    convertBtn(),
    temp,
    feelsLike,
    wind,
    humidity,
    clouds,
    pressure,
    weatherDescription,
    currentTime
  )
  app.appendChild(wrapper)

  return app
}

async function hourly(data) {
  const app = document.querySelector('#root')

  const wrapper = document.createElement('div')
  wrapper.classList.add('body-wrapper')

  const sliderWrapper = document.createElement('div')
  sliderWrapper.classList.add('slider-wrapper')

  const time = document.createElement('span')
  time.classList.add('time')

  for (let i = 1; i < 25; i++) {
    const hourlyWrapper = document.createElement('div')
    hourlyWrapper.classList.add('hourly-wrapper')
    const hourlyTime = document.createElement('span')
    hourlyTime.classList.add('hourly-time')

    const fullTime = new Date(data.hourly[i].dt * 1000)

    timeConversion(hourlyTime, fullTime)

    const hourlyTemp = document.createElement('span')
    hourlyTemp.classList.add('hourly-temp', 'temp')
    hourlyTemp.textContent = `${kToF(data.hourly[i].temp)}`

    const hourlyWind = document.createElement('span')
    hourlyWind.classList.add('hourly-wind', 'wind')
    hourlyWind.textContent = `${mphToKph(data.hourly[i].wind_speed)}`
    // hourlyWind.textContent = `${Math.floor(data.hourly[i].wind_speed)}mph`

    hourlyWrapper.append(hourlyTime, hourlyTemp, hourlyWind)
    sliderWrapper.appendChild(hourlyWrapper)
  }

  const left = document.createElement('div')
  left.classList.add('slider-left', 'slider')

  left.addEventListener('click', () => {
    sliderWrapper.style.marginLeft = '0'
    left.style.backgroundColor = 'white'
    left.style.border = 'none'

    right.style.border = '2px solid white'
    right.style.backgroundColor = 'inherit'
  })

  const right = document.createElement('div')
  right.classList.add('slider-right', 'slider')

  right.addEventListener('click', () => {
    sliderWrapper.style.marginLeft = 'calc(-100% - 23px)'
    right.style.backgroundColor = 'white'
    right.style.border = 'none'

    left.style.border = '2px solid white'
    left.style.backgroundColor = 'inherit'
  })

  wrapper.append(left, right, sliderWrapper)
  app.appendChild(wrapper)

  return app
}

async function daily(data) {
  const app = document.querySelector('#root')

  const wrapper = document.createElement('div')
  wrapper.classList.add('footer-wrapper')

  for (let i = 1; i < 8; i++) {
    const dailyWrapper = document.createElement('div')
    dailyWrapper.classList.add('daily-wrapper')

    const fullTime = new Date(data.daily[i].dt * 1000)

    const dailyTime = document.createElement('span')
    dailyTime.classList.add('daily-time')
    dailyTime.textContent = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(fullTime)

    const dailyTemp = document.createElement('span')
    dailyTemp.classList.add('daily-temp', 'temp')
    dailyTemp.textContent = `${kToF((data.daily[i].temp.max + data.daily[1].temp.min) / 2)}`

    const dailyWind = document.createElement('span')
    dailyWind.classList.add('daily-wind', 'wind')
    dailyWind.textContent = `${mphToKph(data.hourly[i].wind_speed)}`

    dailyWrapper.append(dailyTime, dailyTemp, dailyWind)
    wrapper.appendChild(dailyWrapper)
  }

  app.appendChild(wrapper)

  return app
}

export { callDisplays, defaultDisplay }
