import React, { createContext, useState } from 'react';
import { breakpoints } from '../../css/breakpoints';
import { useIsomorphicEffect } from '../../hooks/useIsomorphicEffect';

type State = {
  [key: string]: boolean;
};
export type BreakpointChecks = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} & State;

type MediaQueries = {
  [key: string]: string;
};

const mediaQueries: MediaQueries = (() => {
  let prevMinWidth = 0;

  return Object.keys(breakpoints).reduce((accum, size, index) => {
    if (index === Object.keys(breakpoints).length - 1) {
      return { ...accum, [size]: `(min-width: ${prevMinWidth}px)` };
    }

    const minWidth = prevMinWidth;
    // @ts-ignore
    const breakpoint = breakpoints[size];
    prevMinWidth = breakpoint;
    return {
      ...accum,
      [size]: `(min-width: ${minWidth}px) and (max-width: ${breakpoint - 1}px)`,
    };
  }, {});
})();

const getKey = (size: string) =>
  `is${size.charAt(0).toUpperCase()}${size.slice(1)}`;

const getState = (): State => {
  const s = Object.keys(mediaQueries).reduce((accum, size) => {
    const key = getKey(size);
    if (typeof window === 'undefined') {
      return {
        ...accum,
        [key]: false,
      };
    }

    const mql =
      typeof window?.matchMedia === 'function'
        ? window.matchMedia(mediaQueries[size])
        : null;
    return { ...accum, [key]: mql?.matches ?? false };
  }, {});
  return s;
};

export const getBreakpointChecks = (state: State): BreakpointChecks => {
  return {
    ...state,
    isMobile: state.isXs || state.isSm,
    isTablet: state.isMd || state.isLg,
    isDesktop: state.isXl || state.isXxl,
  };
};

export const MatchBreakpointsContext = createContext<BreakpointChecks>({
  isMobile: false,
  isTablet: false,
  isDesktop: false,
});

export const MatchBreakpointsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<BreakpointChecks>(() =>
    getBreakpointChecks(getState()),
  );

  useIsomorphicEffect(() => {
    // Create listeners for each media query returning a function to unsubscribe
    const handlers = Object.keys(mediaQueries).map((size) => {
      let mql: MediaQueryList;
      let handler: (matchMediaQuery: MediaQueryListEvent) => void;

      if (typeof window?.matchMedia === 'function') {
        mql = window.matchMedia(mediaQueries[size]);

        handler = (matchMediaQuery: MediaQueryListEvent) => {
          const key = getKey(size);

          setState((prev) =>
            getBreakpointChecks({
              ...prev,
              [key]: matchMediaQuery.matches,
            }),
          );
        };

        // Safari < 14 fix
        if (mql.addEventListener) {
          mql.addEventListener('change', handler);
        }
      }
      return () => {
        // Safari < 14 fix
        if (mql?.removeEventListener) {
          mql.removeEventListener('change', handler);
        }
      };
    });
    setState(getBreakpointChecks(getState()));

    return () => {
      handlers.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, []);
  return (
    <MatchBreakpointsContext.Provider value={state}>
      {children}
    </MatchBreakpointsContext.Provider>
  );
};
