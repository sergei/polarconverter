import './App.css';
import * as React from 'react';
import {useState} from "react";

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import {Link} from "@mui/material";

import convertPolarFormat from "./convertPolar";

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

  const [conversionType, setConversionType] = useState(conversionTypes[0].value);
  const [sourcePolarText, setSourcePolarText] = useState('');
  const [convertedPolarText, setConvertedPolarText] = useState('');

  return (
    <div className="App">
        <Box
            component="form"
            noValidate
            autoComplete="off"
            m={2}
        >
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <TextField id="source-polar" label="Paste content of polar file here"
                               multiline
                               fullWidth
                               maxRows={15}
                               value = {sourcePolarText}
                               onChange={(event) => {
                                   setSourcePolarText(event.target.value);
                               }}
                    />
                </Grid>
                <Grid xs={4}>
                </Grid>
                <Grid xs={2} container
                      direction="row"
                      justifyContent="center"
                      alignItems="center">

                    <TextField
                        id="select-conversion"
                        select
                        label="Select conversion"
                        defaultValue={conversionType}
                        onChange={(event) => {
                            setConversionType(event.target.value);
                        }}
                    >
                        {conversionTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}

                    </TextField>
                </Grid>
                <Grid xs={2} container
                      direction="row"
                      justifyContent="center"
                      alignItems="center">
                    <Button variant="contained" onClick={
                        () => setConvertedPolarText( convertPolarFormat(conversionType, sourcePolarText) )
                    }>Convert</Button>
                </Grid>
                <Grid xs={4}>
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
                    <Link href="https://github.com/sergei/polarconverter">Copyright (c) https://github.com/sergei/polarconverter</Link>
                </Grid>
            </Grid>
        </Box>
    </div>
  );
}

export default App;
