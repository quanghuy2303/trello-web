import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import './index.scss'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

createRoot(document.getElementById('root')!).render(
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <App />
  </CssVarsProvider>
)
