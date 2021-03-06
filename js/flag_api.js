//////////////////////
//* Const and Vars*//
////////////////////

const apiUrl = "https://restcountries.com/v2/all";

const countryList = document.querySelector(".country-list");
var countryListjson = null;

// search box
const searchBox = document.querySelector(".filter-section__search-box--input");

// filter dropdown
const filterLabel = document.querySelector(".filter-section__dropdown--toggle-text");
const filter = document.querySelector(".filter-section__dropdown--cascade");

/////////////////////
//*  API calls   *//
///////////////////

fetch(apiUrl).then((data) => {
    return data.json()
}).then((data) => {
    countryListjson = data
}).then(() => {
    for (let i = 1; i <= 15; i++) {
        var randCountry = getRandom(countryListjson.length)
        countryList.appendChild(makeNode(countryListjson[randCountry], randCountry))
    }
})


////////////////////
//*  Functions  *//
//////////////////

// Create node and attach it to the country list
makeNode = (data, index) => {
    let node = document.createElement("article");
    let flag = document.createElement("div")
    let heading = document.createElement("h4")
    let population = document.createElement("p");
    let region = document.createElement("p");
    let capital = document.createElement("p");

    node.classList.add("country-list__country-card")
    node.setAttribute("data-index", index)
    node.setAttribute("tabindex", "0")

    flag.style.backgroundImage = `url('${data.flag}') `
    flag.classList.add("country-list__country-card--flag-img", "card__img")
    heading.innerHTML = `${data.name}`
    population.innerHTML = `<span>population:</span> ${data.population}`
    region.innerHTML = `<span>region:</span> ${data.region}`
    capital.innerHTML = `<span>capital:</span> ${data.capital}`

    node.appendChild(flag)
    node.appendChild(heading)
    node.appendChild(population)
    node.appendChild(region)
    node.appendChild(capital)

    return node
}

// Get a random number to display random countries each time the page loads
let getRandom = (max) => {
    return Math.floor(Math.random() * max)
}

// Clear country list
let clearCountryList = () => {
    let cardList = document.querySelectorAll(".country-list__country-card")
    cardList.forEach((item) => {
        item.remove()
    })
}


////////////////////////////
//*   Event Listeners   *//
//////////////////////////

// Filter country list by user-query
searchBox.addEventListener("input", (input) => {
    var query = input.target.value
    query = query.trim()
    let filteredList = []
    let regex = new RegExp(query, 'i')

    countryListjson.forEach((item, index) => {
        if (regex.test(item.name) || regex.test(item.capital)) {
            filteredList.push([index, item])
        }
    });
    clearCountryList()
    filteredList.forEach((item) => {
        countryList.appendChild(makeNode(item[1], item[0]))
    })

})

// Filter country list by continent
filter.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-section__dropdown--cascade")) {
        return
    }
    if (e.target.textContent === "--None--") {
        filterLabel.textContent = "Filter by Region"
        filter.classList.add("hide-cascade")
        return
    } else {
        filterLabel.textContent = e.target.textContent
    }

    let filteredList = []
    countryListjson.forEach((item, index) => {
        if (item.region == e.target.textContent) {
            filteredList.push([index, item])
        }
    });
    filter.classList.add("hide-cascade")
    clearCountryList()
    filteredList.forEach((item) => {
        countryList.appendChild(makeNode(item[1], item[0]))
    })
})
// Create a URL which links to another html page and add the json object of a country as a parameter to the url

var events = ["click", "keyup"]

events.forEach((evt) => {
    countryList.addEventListener(evt, (item) => {
        var countryIndex = evt == "click"
            ? item.target.parentNode.getAttribute("data-index")
            : item.target.getAttribute("data-index")
        var countryData = JSON.stringify(countryListjson[countryIndex])
        if ((item.target.parentNode.classList == 'country-list__country-card') && (evt == "click")) {
            window.location.href = `/country_details.html?data=${countryData}`
        } else if ((item.key == "Enter") && (item.target.classList == "country-list__country-card")){
            window.location.href = `/country_details.html?data=${countryData}`
        }
    })
});