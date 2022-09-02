require('dotenv').config();

const {inquirerMenu, readInput, pause, citiesMenu} = require('./helpers/inquirer');
const Searchs = require('./models/seachs');

const main= async () => {
    const searchs = new Searchs();
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Show the message for the user to write the city
                const city = await readInput('City:');

                // Search the city
                const response = await searchs.seachCity(city);

                // Ask to select the city
                const selected = await citiesMenu(response);
                if (selected === '0') continue;

                const selectedCity =  response.find(c => c.id === selected)
                searchs.saveHistory(selectedCity.name);

                // Show weather information
                const weather = await searchs.searchWeather(selectedCity.lat, selectedCity.lng);

                console.clear();
                console.log('\nCity information\n'.green);
                console.log('City:', selectedCity.name.green);
                console.log('Lat:', selectedCity.lat);
                console.log('Lng:', selectedCity.lng);
                console.log('Temperature:', weather.temperature);
                console.log('Min:', weather.min);
                console.log('Max:', weather.max);
                console.log('Weather:', weather.description.green);
                break;
            case 2:
                searchs.History.forEach((city, i) => {
                    console.log(`${((i + 1) + ".").green} ${city}`)
                });
                break;
        }


        if (opt !== 0) await pause();
    } while (opt !== 0)
}

main();