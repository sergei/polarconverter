const fs = require('node:fs');
const convertPolarFormat = require('./../src/convertPolar.js')

fs.readFile('orc-polar.txt', 'utf8', (err, srcPolar) => {
    if (err) {
        console.error(err);
        return;
    }
    let convertedPolar = convertPolarFormat('ORC-EXP', srcPolar)
    console.log('ORC-EXP')
    console.log(convertedPolar);

    convertedPolar = convertPolarFormat('ORC-H5000', srcPolar)
    console.log('ORC-H5000')
    console.log(convertedPolar);
});
