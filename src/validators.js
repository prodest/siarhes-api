// Validadores customizados para serem passados nas funções
// checkPred e checkPredNot.
const moment = require('moment');

// Valida o formato da data val.
module.exports.dateFormat = function(val) {
    return (moment(val, "YYYY-MM-DD", true).isValid());
};

// Valida se a data está dentro do limite.
module.exports.dateLimit = function(val, days) {
    let dataObj = new Date(val);
    let limit = new Date().setUTCHours(0, 0, 0, 0) - days*24*60*60*1000;
    return dataObj.getTime() >= limit;
};

// Se o campo não for nulo, valida se é númerico.
module.exports.opcionalNumerico = function(campo) {
    return typeof campo === 'undefined' || /^[0-9]*$/.test(campo);
};
