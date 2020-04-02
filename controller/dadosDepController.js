const axios = require('axios');
const DadosDep = require('../model/dadosDep');

module.exports = class DadosDepController {
    constructor() {
        this.CEP_API_URL = 'http://cep.bldstools.com/?cep=';
    }

    async getAllDadosDep() {
        await DadosDep.findAll().then(dadosDeps => {
            for (let dadosDep of dadosDeps) {
                const { nome, cep, endereco, bairro, cidade, estado } = dadosDep.dataValues
                console.log(`Nome: ${nome}`);
                console.log(`Cep: ${cep}`);
                console.log(`Endereco: ${endereco}, ${bairro}, ${cidade}, ${estado}\n`);
            }
            console.log(`Foram encontrados ${dadosDeps.length} ceps registrados.`);
        });
    }

    async createDadosDep(name, cep) {
        await this.getCepData(cep).then(async cepData => {
            if (cepData.obj !== null) {
                const dadosDep = {
                    nome: name,
                    cep: Number.parseInt(cep),
                    endereco: cepData.obj.logradouro,
                    bairro: cepData.obj.bairro,
                    cidade: cepData.obj.localidade,
                    estado: cepData.obj.uf
                };
                await DadosDep.findOrCreate({
                    where: { cep: dadosDep.cep },
                    defaults: dadosDep
                }).then(res => {
                    const created = res[1];
                    created ?
                        console.log('\n> Cadastrado com sucesso!\n') :
                        console.log('\n> Cep digitado já está registrado!\n');
                });
            }
            else {
                console.log(cepData.errMessage);
            }
        })
    }

    async deleteDadosDep(cep) {
        await DadosDep.findOne({
            where: { cep },
        }).then(res => {
            if (!res) {
                console.log(`\n> ${cep} não está registrado.\n`);
            }
            else {
                res.destroy();
                console.log(`\n> ${cep} Deletado.\n`);
            }
        }).catch(
            console.log('\n> Ocorreu um erro ao deletar, tente novamente mais tarde\n')
        );
    }

    async getCepData(cep) {
        const NOT_FOUND = { obj: null, errMessage: '\n> Infelizmente o cep digitado não foi encontrado.\n' };
        const NOT_VALID = { obj: null, errMessage: '\n> O cep informado é inválido.\n' };
        const ERROR = { obj: null, errMessage: '\n> Houve um erro ao buscar seu cep, tente novamente mais tarde.\n' };

        try {
            const res = await axios.get(this.CEP_API_URL + cep);
            const { code, result } = res.data;
            switch (code) {
                case 200:
                    return { obj: result };
                case 404:
                    return NOT_FOUND;
                case 401:
                    return NOT_VALID;
                default:
                    return ERROR;
            }
        } catch {
            return ERROR;
        }
    }
}