const main = require('./compileSharedScss')
const theme = process.env.THEME_PAGES || 'CusThemeFT'
const path = require('path')
const rpath = path.join.bind(path, __dirname)

const filesToCompile = [ {
  file: `./themes/${theme}/styles/fonts.scss`,
  outFile: 'fonts.css'
},
  {
    file: `./themes/${theme}/styles/variables.scss`,
    outFile: 'variables.css'
  },
]

main(filesToCompile, rpath(`../../out/assets`))
