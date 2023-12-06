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
// heel etc.),
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

// TWS, 20°, 30°, 40°, 50°, 60°, 70°, 80°, 90°, 100°, 110°, 120°, 130°, 140°, 150°, 160°, 170°, 180°, Upwind VMG, Upwind Angle, Downwind VMG, Downwind Angle
// 4, 0.00, 2.51, 3.56, 4.37, 4.91, 5.24, 5.38, 5.34, 5.12, 5.04, 4.97, 4.62, 4.10, 3.65, 3.19, 2.73, 2.27, 2.84, 46, 3.13, 139
// 6, 0.00, 3.77, 5.15, 6.11, 6.68, 6.99, 7.11, 7.07, 6.98, 7.09, 6.98, 6.56, 5.92, 5.20, 4.58, 4.01, 3.43, 4.03, 44, 4.55, 142
// 8, 0.00, 4.73, 6.27, 7.17, 7.62, 7.85, 7.94, 7.92, 8.03, 8.13, 8.06, 7.77, 7.27, 6.60, 5.90, 5.24, 4.57, 4.84, 42, 5.73, 147
// 10, 0.00, 5.38, 6.84, 7.58, 8.01, 8.33, 8.50, 8.52, 8.43, 8.60, 8.71, 8.52, 8.12, 7.60, 6.96, 6.32, 5.67, 5.24, 40, 6.61, 152
// 12, 0.00, 5.73, 7.11, 7.78, 8.22, 8.57, 8.87, 9.02, 8.96, 8.96, 9.16, 9.18, 8.83, 8.29, 7.71, 7.16, 6.67, 5.46, 39, 7.28, 154
// 14, 0.00, 5.92, 7.24, 7.92, 8.38, 8.76, 9.10, 9.43, 9.52, 9.31, 9.59, 9.84, 9.50, 8.89, 8.35, 7.85, 7.50, 5.59, 39, 7.85, 156
// 16, 0.00, 5.99, 7.32, 8.01, 8.50, 8.91, 9.31, 9.71, 10.02, 9.91, 10.00, 10.49, 10.20, 9.63, 8.96, 8.45, 8.14, 5.66, 38, 8.44, 153
// 20, 0.00, 5.88, 7.38, 8.12, 8.66, 9.15, 9.66, 10.18, 10.78, 11.25, 10.89, 11.67, 11.91, 11.65, 10.62, 9.86, 9.29, 5.68, 39, 10.09, 148
// 25, 0.00, 5.33, 7.27, 8.13, 8.75, 9.34, 9.96, 10.70, 11.57, 12.49, 13.15, 13.32, 14.23, 14.92, 13.59, 12.32, 11.05, 5.58, 40, 12.97, 150
// 30, 0.00, 3.95, 6.75, 8.01, 8.72, 9.39, 10.13, 11.08, 12.20, 13.49, 14.98, 15.18, 16.83, 18.39, 17.32, 15.39, 13.46, 5.35, 43, 16.60, 154
function formatOutputH5000Polar(polar){
    const twsValues = Object.keys(polar.perTws).sort((a, b) => a - b)
    const twaValues = Object.keys(polar.perTwa).sort((a, b) => a - b)

    // Make header
    let outputPolar = ''
    outputPolar += 'TWS'
    for(let twa of twaValues){
        outputPolar += `, ${twa}°`
    }
    outputPolar += '\n'

    for( let tws of twsValues){
        outputPolar += `${tws}`
        for( let twa of twaValues){
            outputPolar += `, ${polar.perTws[tws][twa]}`
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
    }else if( conversionTo === 'H5000'){
        return formatOutputH5000Polar(polar)
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
