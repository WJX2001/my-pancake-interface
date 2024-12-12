import React from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { MatchBreakpointsProvider } from './contexts/MatchBreakpoints/Provider';

export const UIKitProvider: React.FC<
  React.PropsWithChildren<{ theme: DefaultTheme; children: React.ReactNode }>
> = ({ theme, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <MatchBreakpointsProvider>{children}</MatchBreakpointsProvider>
    </ThemeProvider>
  );
};
