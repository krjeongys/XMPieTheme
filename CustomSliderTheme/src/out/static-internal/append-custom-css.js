(function() {

    const queryOrCookieStrToObj = function(str) {
      if (str && str !== '') {
        return JSON.parse('{"' +
          str
            .replace(/^(.*)\?/, '')
            .split(/[&;]\s?/g)
            .map(function(keyval){ return keyval.replace(/=/, '":"')})
            .join('","')
          + '"}', function (key, value) {
          return key === "" ? value : decodeURIComponent(value)
        })
      }
      return {}
    }

    var search = location.search.substring(1);
    var queryParams = queryOrCookieStrToObj(search)

    var cookieParams = {};
    document.cookie && document.cookie.split(/\s*;\s*/).forEach(function(pair) {
      pair = pair.split(/\s*=\s*/);
      cookieParams[pair[0]] = pair.splice(1).join('=');
    });

    if (queryParams.StoreGuid) {
      cookieParams._storeID = queryParams.StoreGuid
      document.cookie = "_storeID=" + queryParams.StoreGuid
    }

    //Initialize the _showThemeAsDraft only when logging to the application. This is when the 'SecurityToken' param exists
    if (queryParams.SecurityToken) {
      const isDraft = (!!queryParams.ShowThemeAsDraft).toString()
      cookieParams._showThemeAsDraft = isDraft
      document.cookie = "_showThemeAsDraft=" + isDraft
    }

    var storeID = queryParams.StoreGuid || cookieParams._storeID
    var status = cookieParams._showThemeAsDraft === 'true' ? 'Draft' : 'Published'

    document.writeln('<link rel="stylesheet" href="' + '/uStoreThemeCustomizations/' + storeID + '/' + status + '/Css/variables.css?rand=' + Math.random() +'"/>')
    document.writeln('<link rel="stylesheet" href="' + '/uStoreThemeCustomizations/' + storeID + '/' + status + '/Css/Custom.css?rand=' + Math.random() +'"/>')
    document.writeln('<link rel="stylesheet" href="' + '/uStoreThemeCustomizations/' + storeID + '/' + status + '/Css/fonts.css?rand=' + Math.random() +'"/>')
  }
)()
