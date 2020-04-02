const inquirer = require('inquirer');
const { db } = require('../database/db');
const DadosDepController = require('../controller/dadosDepController');

module.exports = class Menu {

    // menu option constants
    static REGISTER_CEP = 'Registrar novo cep';
    static DELETE_CEP = 'Deletar cep';
    static SHOW_CEPS = 'Mostrar ceps inseridos';
    static SAVE_JSON = 'Salvar ceps em formato JSON';
    static LEAVE = 'Sair';

    constructor() {
        this.options = [Menu.REGISTER_CEP, Menu.DELETE_CEP, Menu.SHOW_CEPS, Menu.SAVE_JSON, Menu.LEAVE];
        this.dadosDepController = new DadosDepController();
    }

    /**
     * core program loop, it shows options and handle the option chose by the user.
     */
    async run() {
        let cep = '', name = '';
        while (true) {
            const option = await this.chooseOption();
            switch (option) {
                case Menu.REGISTER_CEP:
                    cep = await this.write('cep', 'Digite o cep: ');
                    name = await this.write('name', 'Digite o nome da pessoa: ');
                    await this.dadosDepController.createDadosDep(name, cep);
                    break;
                case Menu.SHOW_CEPS:
                    await this.dadosDepController.getAllDadosDep();
                    break;
                case Menu.SAVE_JSON:
                    await this.dadosDepController.saveInJson();
                    break;
                case Menu.DELETE_CEP:
                    cep = await this.write('cep', 'Digite o cep: ');
                    cep = Number.parseInt(cep.replace('-', ''));
                    await this.dadosDepController.deleteDadosDep(cep);
                    break;
                case Menu.LEAVE:
                    db.close();
                    process.exit();
                default:
                    console.log('Opção inexistente.');
            }
        }
    }

    /**
     * shows a menu screen containing options.
     * return the options chose by the user
     */
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

    /**
    * @param {string} fieldName - fieldName is the variable that the input refer
    * @param {string} message - message that will appear on screen
    * shows question waiting for user input.
    * return the the user input
    */
    async write(fieldName, message) {
        const res = await inquirer.prompt([{
            name: fieldName,
            type: 'input',
            message,
        }]);
        return res[fieldName];
    }

    /**
     * clear terminal screen
     */
    clearConsole() {
        console.log('\x1bc');
    }
}