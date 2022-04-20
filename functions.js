const Diff = require('diff');

function codeComparison(answer, modelAnswer){
    const diff = Diff.diffWords(answer, modelAnswer);

    
}

module.exports.codeComparison = codeComparison;