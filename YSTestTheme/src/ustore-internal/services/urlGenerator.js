import themeContext from './themeContext';
import { routes } from '$routes';
import { isServer } from '$ustoreinternal/services/utils';
import {getNextConfig} from "./utils";

class UrlGenerator {

  constructor() {
    this.routes = routes.filter(r => (
      r.name.indexOf(':languageCode') > -1 &&
      r.name.indexOf(':page') > -1)
    ).map(r => r.name);
  }

  get(params) {
    const { languageCode, storeID } = themeContext.get();
    const { assetPrefix} = getNextConfig()

    params.languageCode = languageCode;
    params.storeID = storeID;
    const entries = Object.entries(params);

    const r = this.routes.map(r => {
      let result = r;
      entries.forEach(([key, value]) => {
        result = result.replace(`:${key}`, value)
      });
      return result;
    }).filter(r => r.indexOf(':') === -1)
      .reduce((res, r) => res.length < r.length ? r : res, '');

    return `${isServer() ? assetPrefix : ''}${r}`;
  }
}

export default new UrlGenerator();
