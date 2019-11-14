import Document, { Head, Main, NextScript } from 'next/document';
import { isServer, setCookie, getNextConfig } from "$ustoreinternal/services/utils";
import { createHeadSection } from '$ustoreinternal/services/headSection'
import { createFooterScripts} from '$ustoreinternal/services/footerScriptsSection'

export default class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const globalVar = isServer() ? global : window;
    const { storeScriptUrls, storeStyleUrls } = {} //globalVar['__USTORE_CONFIG__'] || {};
    const  { assetPrefix}  = getNextConfig()
    return (
      <html lang="en">
        <Head>
          { createHeadSection(storeStyleUrls, assetPrefix) }
          {/* This is for a future support of ie 11 */}
          {/*<script src={`${assetPrefix}/static-internal/css-vars-ponyfill.min.js` }/>*/}
          {/*<script src={`${assetPrefix}/static-internal/ie-11-polyfill.js` }/>*/}
          <script src={`${assetPrefix}/static-internal/append-custom-css.js` }/>
          <script src={`${assetPrefix}/static-internal/append-localization.js?rand=${Math.random()}` }/>
          <script src={`${assetPrefix}/static-internal/append-theme-editor-vars.js` }/>
        </Head>
        <body>
          <Main />
          <NextScript />
         { createFooterScripts(storeScriptUrls, assetPrefix) }
          <iframe id="legacy-iframe" src="about:blank" className="iframe" height="0"/>
        </body>
      </html>
    );
  }
}
