const fs = require('fs');
const axios = require('axios');

class Searchs {
    history = [];
    path = './db/database.json';
    constructor() {
        this.readDB();
    }

    get History() {
        return this.history.map(city => {
            let words = city.split(' ');
            words = words.map(w => w[0].toUpperCase() + w.substring(1));
            return words.join(' ');
        });
    }

    get paramsMapBox() {
        return {
            'proximity':'ip',
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'en'
        };
    }

    get paramsOpenWeather() {
        return {
            'appid':process.env.OPEN_WEATHER_KEY,
            'units':'metric'
        };
    }

    async seachCity(city = '') {
        try {
            // http request
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
                params: this.paramsMapBox
            });

            const response = await instance.get();
            return response.data.features.map(city => ({
                id: city.id,
                name: city.place_name,
                lng: city.center[0],
                lat: city.center[1],
            }));
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async searchWeather(lat, lng) {
        try {
            // http request
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.paramsOpenWeather, 
                    'lat': lat, 
                    'lon': lng
                }
            });

            const response = await instance.get();
            return {
                description: response.data.weather[0].description,
                temperature: response.data.main.temp,
                min: response.data.main.temp_min,
                max: response.data.main.temp_max
            };
        } catch (error) {
            console.log(error);
        }
    }

    saveHistory(city = '') {
        if (this.history.includes(city.toLocaleLowerCase())) return;

        this.history.splice(0,5);
        this.history.unshift(city.toLocaleLowerCase());

        // save in DB
        this.saveDB();
    }

    saveDB() {
        const payload = {
            history: this.history
        }
        fs.writeFileSync(this.path, JSON.stringify(payload));
    }

    readDB() {
        if (!fs.existsSync(this.path)) return;

        const info = fs.readFileSync(this.path, {encoding:'utf-8'});
        const data = JSON.parse(info);

        this.history = data.history;
    }
}

module.exports = Searchs;