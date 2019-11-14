(function() {
    var caltureRegex = /\/([a-z]{2,}-[A-Za-z]{2,})/;

    var match = location.pathname.match(caltureRegex)

    if (match.length >= 2) {
      document.writeln('<script type="application/javascript" src="' + '/uStoreThemes/Global/Localizations/' + match[1] + '.js?rand=' + Math.random() +'"></script>')
    }
  }
)()

