const inquirer = require('inquirer');

module.exports = class Menu {
    constructor() {
        this.SEARCH_CEP = 'Buscar dados do CEP';
        this.SHOW_CEPS = 'Mostrar ceps encontrados';
        this.LEAVE = 'Sair';
        this.options = [this.SEARCH_CEP, this.SHOW_CEPS, this.LEAVE]
    }

    async chooseOption() {
        const res = await inquirer.prompt([{
            name: 'option',
            type: 'rawlist',
            message: 'Escolha sua opção\n*utilize as setas do teclado e enter para escolher.',
            choices: this.options,
        }]);
        clearConsole();
        return res.option;
    }

    async writeCep() {
        const res = await inquirer.prompt([{
            name: 'cep',
            type: 'input',
            message: 'Digite o cep:',
        }]);
        clearConsole();
        return res.cep;
    }

    clearConsole() {
        console.log('\x1bc');
    }
}