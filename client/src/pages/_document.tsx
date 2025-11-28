import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="emotion-insertion-point" content="" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <body>
        <div id="__next"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
