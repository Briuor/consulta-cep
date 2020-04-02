const Menu = require('./view/menu');

(async () => {
    const menu = new Menu();
    await menu.run();
})();


