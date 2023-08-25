import { createTheme } from '@mui/material/styles';

export const AirBrBTheme = createTheme({
  palette: {
    primary: {
      // AirBrB Rausch
      main: '#FF5A5F',
    },
    white: {
      main: '#FFFFFF'
    },
    black: {
      main: '#000000'
    },
    blue: {
      main: '#1890ff'
    }
  },
  components: {
    MuiCardHeader: {
      styleOverrides: {
        content: {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: '#FF5A5F',
          color: 'white',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#FF5A5F',
          '&:hover': {
            color: '#993639',
          }
        },
      },
    },
  }
});

export const DefaultTheme = createTheme({
  palette: {
    primary: {
      // AirBrB Rausch
      main: '#FF5A5F',
    },
    white: {
      main: '#FFFFFF'
    },
    black: {
      main: '#000000'
    },
    blue: {
      main: '#1890ff'
    }
  },
  components: {
    MuiCardHeader: {
      styleOverrides: {
        content: {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }
      }
    }
  }
});
