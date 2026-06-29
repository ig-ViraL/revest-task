'use client';
import { ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import Link from 'next/link';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>Revest App</Typography>
              <Button color="inherit" component={Link} href="/signup">Signup</Button>
              <Button color="inherit" component={Link} href="/products">Products</Button>
              <Button color="inherit" component={Link} href="/orders">Orders</Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>{children}</Box>
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
