import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      '*': {
        direction: 'rtl !important',
        textAlign: 'right !important'
      },
      'input, textarea': {
        direction: 'rtl !important',
        textAlign: 'right !important'
      },
      '.MuiTypography-root': {
        direction: 'rtl !important',
        textAlign: 'right !important'
      },
      '.MuiFormControl-root': {
        direction: 'rtl !important',
        textAlign: 'right !important'
      },
      '.MuiInputBase-root': {
        direction: 'rtl !important',
        textAlign: 'right !important'
      }
    }}
  />
);

export default GlobalStyles; 