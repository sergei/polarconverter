import './App.css';
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import {useState} from "react";
import convertPolarFormat from "./convertPolar";
import {Link} from "@mui/material";

const conversionTypes = [
    {
        value: 'ORC-EXP',
        label: 'ORC to Expedition',
    },
    {
        value: 'ORC-H5000',
        label: 'ORC to B&G H5000',
    },
];

function App() {

    const [conversionType, setConversionType] = useState('ORC-EXP');
    const handleConversionType = (event) => {
        setConversionType(event.target.value);
    };

  const [sourcePolarText, setSourcePolarText] = useState('');
  const handleSourcePolarTextChange = (event) => {
      setSourcePolarText(event.target.value);
  };

  const [convertedPolarText, setConvertedPolarText] = useState('');


  function doConversion() {
      let newPolar = convertPolarFormat(conversionType, sourcePolarText)
      setConvertedPolarText(newPolar)
      console.log('Converting ' + newPolar)
  }

  return (
    <div className="App">
        <Box
            component="form"
            noValidate
            autoComplete="off"
        >
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <TextField id="source-polar" label="Paste polar file here"
                               multiline
                               fullWidth
                               maxRows={15}
                               value = {sourcePolarText}
                               onChange={handleSourcePolarTextChange}
                    />
                </Grid>
                <Grid xs={6}>
                    <TextField
                        id="select-conversion"
                        select
                        label="Select"
                        defaultValue={conversionType}
                        helperText="Select conversion"
                        onChange={handleConversionType}
                    >
                        {conversionTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}

                    </TextField>
                </Grid>
                <Grid xs={6}>
                    <Button variant="contained" onClick={doConversion}>Convert</Button>
                </Grid>
                <Grid xs={12}>
                    <TextField id="converted-polar" label="Converted polar file"
                               multiline
                               maxRows={15}
                               fullWidth
                               value = {convertedPolarText}
                    />
                </Grid>
                <Grid xs={12}>
                    <Link href="https://github.com/sergei/polarconverter">https://github.com/sergei/polarconverter</Link>
                </Grid>
            </Grid>
        </Box>
    </div>
  );
}

export default App;
