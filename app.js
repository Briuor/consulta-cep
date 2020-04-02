const Menu = require('./view/menu');
const DadosDepController = require('./controller/dadosDepController');

(async () => {
    let menu = new Menu();
    let dadosDepController = new DadosDepController();
    let cep = '', name = '';
    while (true) {
        const option = await menu.chooseOption();
        switch (option) {
            case Menu.REGISTER_CEP:
                cep = await menu.write({ fieldName: 'cep', message: 'Digite o cep: ' });
                name = await menu.write({ fieldName: 'name', message: 'Digite o nome da pessoa: ' });
                await dadosDepController.createDadosDep(name, cep);
                break;
            case Menu.SHOW_CEPS:
                await dadosDepController.getAllDadosDep();
                break;
            case Menu.DELETE_CEP:
                cep = await menu.write({ fieldName: 'cep', message: 'Digite o cep: ' });
                await dadosDepController.deleteDadosDep(cep);
                break;
            case Menu.LEAVE:
                process.exit();
            default:
                console.log('Opção inexistente, tente novamente.');
        }
    }
})();


