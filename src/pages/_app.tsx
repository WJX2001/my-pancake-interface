
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Fragment } from 'react';
function MyApp(
  props: AppProps<{ initialReduxState: any; dehydratedState: any }>,
) {
  return (
    <>
      {/* <ResetCSS /> */}
      <App {...props} />
    </>
  );
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>;
  /** render component without all layouts */
  pure?: true;
  /** is mini program */
  mp?: boolean;
  /**
   * allow chain per page, empty array bypass chain block modal
   * @default [ChainId.BSC]
   * */
  chains?: number[];
  isShowScrollToTopButton?: true;
  screen?: true;
  isShowV4IconButton?: false;
  /**
   * Meta component for page, hacky solution for static build page to avoid `PersistGate` which blocks the page from rendering
   */
  Meta?: React.FC<React.PropsWithChildren<unknown>>;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  if (Component.pure) {
    return <Component {...pageProps} />;
  }

  const Layout = Component.Layout || Fragment;
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
