import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0072C6', // Azul FIUBA
    },
    secondary: {
      main: '#FFAA00', // Un color complementario
    },
    background: {
      default: '#f5f5f5', // Un fondo claro
      paper: '#ffffff' // Fondo de los contenedores
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;