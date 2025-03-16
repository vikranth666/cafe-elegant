import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import store from './store';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A3E3E', // Dark brown
      light: '#6B5B5B',
      dark: '#2A2424',
    },
    secondary: {
      main: '#D4A373', // Light brown/coffee color
    },
    background: {
      default: '#FAF3E0', // Cream color
    }
  },
  typography: {
    fontFamily: "'Playfair Display', serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    body1: {
      fontFamily: "'Lato', sans-serif",
    }
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Navbar />
            <AppRoutes />
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
