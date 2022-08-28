import { Box, Grid, Slider } from "@mui/material"
import MuiInput from '@mui/material/Input';


const InputSlider = ({limitValue, handleSliderChange, handleInputChange}) => (
  <>
  <Box >
    <Grid container spacing={2} alignItems="center">
      <Grid item xs>
        <Slider
          value={typeof limitValue === 'number' ? limitValue : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          color='success'
        />
      </Grid>
      <Grid item>
        <MuiInput
          sx={{ width: 46 }}
          value={limitValue}
          size="small"
          onChange={handleInputChange}
          // onBlur={handleBlur}
          inputProps={{
            step: 5,
            min: 0,
            max: 100,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
      </Grid>
    </Grid>
  </Box>
  </>
)

export default InputSlider
