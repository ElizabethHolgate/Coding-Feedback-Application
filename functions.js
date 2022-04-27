const Diff = require('diff');

function codeComparison(answer, modelAnswer){
    const diff = Diff.diffWords(answer, modelAnswer);
    return diff;
    
}

module.exports.codeComparison = codeComparison;