let favorites = JSON.parse(localStorage.getItem('favoritePlants') || '[]');

const app = {
    pages: [],
    // to say when the page has been shown we dispatch the event 
    show: new Event('show'),
    init: function() {
        // finding evrything with the class page
        app.pages = document.querySelectorAll('.page');
        app.pages.forEach((pg) => {
            // calling event and function
            pg.addEventListener('show', app.pageShown)
        })
        // looping through all of the links in the html
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', app.nav);
        })

        // to know what page we are on, title and id that will be placed into the location bar
        history.replaceState({}, 'Home', '#home');
        // for handeling the backbutton
        window.addEventListener('popstate', app.poppin);
    },

    nav: function(ev) {
        ev.preventDefault();
        // taking the current page and getting the data target
        let currentPage = ev.target.getAttribute('data-target');
        // first we remove the active class from one of the pages
        document.querySelector('.active').classList.remove('active');
        // adding the class active to show the correct page
        document.getElementById(currentPage).classList.add('active');
        // adding a new entry to the location bar
        history.pushState({}, currentPage, `#${currentPage}`);
        // telling the app that we went to a new page
        document.getElementById(currentPage).dispatchEvent(app.show);
    },

    // simulating in the nav function 
    poppin: function(ev) {
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#', '');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
        document.getElementById(hash).dispatchEvent(app.show);
    }
}

// when everything has been read call the app.init function
document.addEventListener('DOMContentLoaded', app.init);

// List up all available plants
let plants = [
    {
        id: 'aloe',
        img: 'images/aloe.jpg',
        name: 'Aloe vera',
    },
    {
        id: 'areca',
        img: 'images/arecapalm.jpg',
        name:'Areca Palm'
    },
    {
        id: 'calathea',
        img: 'images/Calathea.jpg',
        name:'Calathea'
    },
    {
        id: 'ficus',
        img: 'images/ficus.jpg',
        name:'Ficus'
    },
    {
        id: 'moneytree',
        img: 'images/moneytree.jpg',
        name:'Moneytree'
    },
    {
        id: 'Pilea',
        img: 'images/pileaplant.jpg',
        name:'Pilea'
    }
];

const plantsContainer = document.getElementById('plants-container');
const favoritesContainer = document.getElementById('favorites-container');

const createPlant = (plantId) => {
    const plantEl = document.createElement('div');
    plantEl.className = 'plant-card';
    if(plantId) {
        plantEl.id = `plant-${plantId}`;
    }
    return plantEl;
}

const createImg = (src, alt) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    return img;
}

const createTitle = (name) => {
    const title = document.createElement('h3');
    title.innerHTML = name;
    return title;
}

const createButton = (id, text, onClick) => {
    const button = document.createElement('button');
    button.id = id;
    button.innerHTML = text;
    button.onclick = onClick;
    return button;
}

const renderFavoritePlant = (plantId) => {
    // Find favorite plant from plant list
    const favoritePlant = plants.find(plant => plant.id == plantId);
    
    // Only render favorite plant if it exists
    if (favoritePlant) {
        // Create plant el 
        const favEl = createPlant(plantId);

        // Create all child elements for plant
        const img = createImg(favoritePlant.img, favoritePlant.name);
        const title = createTitle(favoritePlant.name);
        const button = createButton(favoritePlant.id, '✕', removeFromFavorites);

        // Add all child elements to plant
        favEl.appendChild(img);
        favEl.appendChild(title);
        favEl.appendChild(button);
        
        // Add plant element to page
        favoritesContainer.appendChild(favEl);
    }
}

const removeFavoritePlant = (plantId) => {
    document.getElementById(`plant-${plantId}`).remove();
}

const addToFavorites = (event) => {
    const plantId = event.target.getAttribute('id');
    if (!favorites.includes(plantId)) {
        favorites.push(plantId);
        localStorage.setItem('favoritePlants', JSON.stringify(favorites))
        renderFavoritePlant(plantId);
    }
}

const removeFromFavorites = (event) => {
    const plantId = event.target.getAttribute('id');
    if (favorites.includes(plantId)) {
        favorites = favorites.filter(id => id !== plantId);
        localStorage.setItem('favoritePlants', JSON.stringify(favorites))
        removeFavoritePlant(plantId);
    }
}

plants.forEach(plant => {
    // Create plan el
    const plantEl = createPlant();

    // Create plant content
    const img = createImg(plant.img, plant.name);
    const title = createTitle(plant.name);
    const button = createButton(plant.id, '♥', addToFavorites);

    // Add plant content to plan el
    plantEl.appendChild(img);
    plantEl.appendChild(title);
    plantEl.appendChild(button);

    // Add plant el to DOM
    plantsContainer.appendChild(plantEl);
});

favorites.forEach(renderFavoritePlant);
