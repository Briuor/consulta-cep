const axios = require('axios');
const fs = require('fs');
const DadosDep = require('../model/dadosDep');

module.exports = class DadosDepController {
    constructor() {
        this.CEP_API_URL = 'http://cep.bldstools.com/?cep=';
    }

    /**
     * Get all dadosDep from database and show
     */
    async getAllDadosDep() {
        await DadosDep.findAll().then(dadosDeps => {
            for (let dadosDep of dadosDeps) {
                const { nome, cep, endereco, bairro, cidade, estado } = dadosDep.dataValues
                console.log(`Nome: ${nome}`);
                console.log(`Cep: ${cep}`);
                console.log(`Endereco: ${endereco}, ${bairro}, ${cidade}, ${estado}\n`);
            }
            console.log(`\n> Foram encontrados ${dadosDeps.length} ceps registrados.\n`);
        }).catch(() => {
            console.log('\n> Ocorreu um erro ao buscar ceps, tente novamente mais tarde.\n');
        });
    }

    /**
     * Get all dadosDep from database and save in json format
     */
    async saveInJson() {
        await DadosDep.findAll().then(dadosDeps => {
            if (dadosDeps.length > 0) {
                fs.writeFileSync('dados.json', JSON.stringify(dadosDeps));
                console.log(`\n> JSON dos registros gerado como "dados.json"\n`);
            }
            else {
                console.log('\n> Nenhum registro encontrado.\n');
            }
        }).catch(() => {
            console.log('\n> Ocorreu um erro ao salvar, tente novamente mais tarde.\n');
        });
    }

    /**
     * 
     * @param {string} name - user input name 
     * @param {string} cep - user input cep
     * Get cep data from api, if valid data insert into database if not exist yet
     * else shows a warning message
     */
    async createDadosDep(name, cep) {
        // get data from cep api
        await this.getCepData(cep).then(async cepData => {
            if (cepData.obj !== null) {
                // create dadosDep instance
                const dadosDep = {
                    nome: name,
                    cep: cepData.obj.cep,
                    endereco: cepData.obj.logradouro,
                    bairro: cepData.obj.bairro,
                    cidade: cepData.obj.localidade,
                    estado: cepData.obj.uf,
                    retorno_api: cepData.jsonResponse
                };
                // try to insert into database if not exist yet else show warning message
                await DadosDep.findOrCreate({
                    where: { cep: dadosDep.cep },
                    defaults: dadosDep
                }).then(res => {
                    const wasCreated = res[1];
                    if (wasCreated)
                        console.log('\n> Cadastrado com sucesso!\n')
                    else
                        console.log('\n> Cep digitado já está registrado!\n');
                }).catch(() => {
                    console.log('\n> Ocorreu um erro ao registrar cep, tente novamente mais tarde.\n');
                });
            }
            else {
                console.log(cepData.errMessage);
            }
        })
    }

    /**
     * Try to find a dadosDep containing cep param in database
     * if found delete it
     * else shows a warning message
     * @param {string} cep - user input cep
     */
    async deleteDadosDep(cep) {
        await DadosDep.findOne({ where: { cep } }).then(res => {
            if (!res) {
                console.log(`\n> ${cep} não está registrado.\n`);
            }
            else {
                res.destroy();
                console.log(`\n> ${cep} Deletado.\n`);
            }
        }).catch(() => {
            console.log('\n> Ocorreu um erro ao deletar, tente novamente mais tarde\n');
        });
    }

    /**
     * get data from cep api by cep parameter
     * if cep data found
     * return { obj: resultData, jsonResponse: responseJson}
     * else if not found
     * return { obj: null, errMessage: errorMessage,}
     * @param {string} cep 
     */
    async getCepData(cep) {
        const NOT_FOUND = { obj: null, errMessage: '\n> Infelizmente o cep digitado não foi encontrado.\n' };
        const NOT_VALID = { obj: null, errMessage: '\n> O cep informado é inválido.\n' };
        const ERROR = { obj: null, errMessage: '\n> Houve um erro ao buscar seu cep, tente novamente mais tarde.\n' };

        try {
            const res = await axios.get(this.CEP_API_URL + cep);
            const { code, result } = res.data;
            switch (code) {
                case 200:
                    return { obj: result, jsonResponse: res.data };
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