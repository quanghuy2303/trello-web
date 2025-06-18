import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface CssVarsTheme {
    trello: {
      appBarHeight: string;
      boardBarHeight: string;
      boardContentHeight: string;
    };
  }

  interface CssVarsThemeOptions {
    trello?: {
      appBarHeight?: string;
      boardBarHeight?: string;
      boardContentHeight: string;
    };
  }
}