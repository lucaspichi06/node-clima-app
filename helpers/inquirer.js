const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'opcion',
        message: 'What would you like to do?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Search city`
            },
            {
                value: 2,
                name: `${'2.'.green} Search history`
            },
            {
                value: 0,
                name: `${'0.'.green} Exit`
            }
        ]
    }
];

const inquirerMenu = async() => {
    console.clear();
    console.log('==================================='.green.bold);
    console.log('         Select an option          '.white.bold);
    console.log('===================================\n'.green.bold);

    const {opcion} = await inquirer.prompt(questions);
    return opcion;
}

const pause = async() => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${'enter'.green} to continue`
        }
    ];
    console.log('\n');
    await inquirer.prompt(question);
}

const readInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Please insert a value';
                }
                return true;
            }
        }
    ];

    const {description} = await inquirer.prompt(question);
    return description;
}

const citiesMenu = async(cities = []) => {
    const choices = cities.map((city, i) => {
        return {
            value: city.id,
            name: `${((i + 1) + '.').green } ${city.name}`
        }
    });

    choices.unshift({
        value: '0',
        name: `${`0.`.green} Cancel`
    })

    const citiesQuestions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select the city',
            choices
        }
    ]
    const {id} = await inquirer.prompt(citiesQuestions);
    return id;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    citiesMenu
}