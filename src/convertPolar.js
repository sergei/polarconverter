/// # Alchemist SunFast 3300
//
// twa/tws;4;6;8;10;12;14;16;18;20;22;24;26;28;30
// 30;1;1;1;1;1;1;1;1;3;4;5;5;5;6
// 40;3.1;4.4;5.5;6.3;6.8;7.1;7.2;7.3;7.5;7.6;7.7;7.7;7.7;7.8
function parseOrcPolar(sourcePolarText) {
    const lines = sourcePolarText.split(/\r?\n|\r|\n/g);

    let twsValues = []
    let polars = {
        perTwa: {},  // twa -> tws -> speed
        perTws: {},  // tws -> twa -> speed
    }
    // Iterate over lines
    for (const line of lines) {
        // Skip empty lines and comments
        if (line.length === 0 || line.startsWith('#')) {
            continue
        }
        // First line is TWS values
        if (line.startsWith('twa/tws')) {
            twsValues = line.split(/;/g)
        } else {  // Rest of the lines the line per TWA
            const items = line.split(/;/g)
            const twa = items[0]
            const twsDict = {}
            for (let i = 1; i < items.length; i++) {
                const tws = twsValues[i]
                const speed = parseFloat(items[i])
                // console.log(`twa=${twa} tws=${tws} speed=${speed}`)
                twsDict[tws] = speed
                if (polars.perTws[tws] === undefined) {
                    polars.perTws[tws] = {}
                }
                polars.perTws[tws][twa] = speed
            }
            polars.perTwa[twa] = twsDict
        }
    }
    return {success: true, polar: polars}
}

///The Expedition polar format is very versatile. It does
// however have a few restrictions:
// The first column always contains the Tws
// values,
// Other columns are in pairs of Twa and Bsp (or
// heel etc),
// Twa must increase across a row,
// Tws must increase downwards.
// Normally we set the last column at 180 twa
function formatOutputExpeditionPolar(polar){
    let outputPolar = ''
    const twsValues = Object.keys(polar.perTws).sort((a, b) => a - b)
    for( let tws of twsValues){
        outputPolar += `${tws} `
        const twaValues = Object.keys(polar.perTws[tws]).sort((a, b) => a - b)
        for( let twa of twaValues){
            outputPolar += `${twa} ${polar.perTws[tws][twa]} `
        }
        outputPolar += '\n'
    }

    return {success: true, polar: outputPolar}
}

function parseSourcePolar(conversionType, sourcePolarText){
    const conversion = conversionType.split('-')
    const conversionFrom = conversion[0]
    if( conversionFrom === 'ORC'){
        return parseOrcPolar(sourcePolarText);
    }else{
        return {success: false, error: 'Unsupported conversion type'}
    }
}

function formatOutputPolar(conversionType, polar){
    const conversion = conversionType.split('-')
    const conversionTo = conversion[1]
    if( conversionTo === 'EXP'){
        return formatOutputExpeditionPolar(polar)
    }else{
        return {success: false, error: 'Unsupported conversion type'}
    }
}

function convertPolarFormat(conversionType, sourcePolarText){
    let r = parseSourcePolar(conversionType, sourcePolarText)
    if ( ! r.success ){
        return r.error
    }

    r = formatOutputPolar(conversionType, r.polar)
    if ( ! r.success ){
        return r.error
    }

    return r.polar
}

module.exports = convertPolarFormat
