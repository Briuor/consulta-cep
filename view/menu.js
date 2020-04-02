const inquirer = require('inquirer');

module.exports = class Menu {

    // menu option constants
    static REGISTER_CEP = 'Inserir novo cep';
    static DELETE_CEP = 'Deletar cep';
    static SHOW_CEPS = 'Mostrar ceps inseridos';
    static LEAVE = 'Sair';

    constructor() {
        this.options = [Menu.REGISTER_CEP, Menu.DELETE_CEP, Menu.SHOW_CEPS, Menu.LEAVE];
    }

    async chooseOption() {
        const res = await inquirer.prompt([{
            name: 'option',
            type: 'list',
            suffix: '(Use as setas e enter para escolher)',
            message: 'Escolha sua opção',
            choices: this.options,
        }]);
        this.clearConsole();
        return res.option;
    }

    async write({ fieldName, message }) {
        const res = await inquirer.prompt([{
            name: fieldName,
            type: 'input',
            message,
        }]);
        return res[fieldName];
    }

    clearConsole() {
        console.log('\x1bc');
    }
}