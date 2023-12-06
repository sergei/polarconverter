const fs = require('node:fs');
const convertPolarFormat = require('./../src/convertPolar.js')

fs.readFile('orc-polar.txt', 'utf8', (err, srcPolar) => {
    if (err) {
        console.error(err);
        return;
    }
    const convertedPolar = convertPolarFormat('ORC-EXP', srcPolar)
    console.log(convertedPolar);
});
