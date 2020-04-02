const Menu = require('./view/menu');

(async () => {
    let menu = new Menu();
    let run = true;
    while (run) {
        const option = await menu.chooseOption();
        switch (option) {
            case menu.SEARCH_CEP:
                let cep = await menu.writeCep();
                break;
            case menu.SHOW_CEPS:
                break;
            case menu.LEAVE:
                run = false;
                break;
            default:
                console.log('Opção inexistente, tente novamente.');
        }
    }
    console.log('Espero que tenha encontrado seu cep!');
})();


