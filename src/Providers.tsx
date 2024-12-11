import { Store } from '@reduxjs/toolkit';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
// import { dark, light, UIKitProvider } from '@pancakeswap/uikit';
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from 'next-themes';
import { Provider } from 'react-redux';
import { NAMEWJX } from '@/Packages/uikit/src/Providers';

const queryClient = new QueryClient();

// const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({
//   children,
//   ...props
// }) => {
//   const { resolvedTheme } = useNextTheme();
//   return (
//     <UIKitProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
//       {children}
//     </UIKitProvider>
//   );
// };

const Providers: React.FC<
  React.PropsWithChildren<{
    store: Store;
    children: React.ReactNode;
    dehydratedState: any;
  }>
> = ({ children, store, dehydratedState }) => {
  console.log(NAMEWJX)
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Provider store={store}>
          <NextThemeProvider>{children}</NextThemeProvider>
        </Provider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

export default Providers;
