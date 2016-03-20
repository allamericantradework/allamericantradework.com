'use strict'
var fs = require('fs-extra')
var Handlebars = require('handlebars')
var minimist = require('minimist')

var OUT_DIR = 'dist'
var PARTIALS_DIR = 'partials'
var PAGES_DIR = 'pages'

function nameToObj (dirName) {
  return (name) => {
    return {
      name: name.split('.').shift(),
      inPath: dirName + '/' + name,
      outPath: OUT_DIR + '/' + name
    }
  }
}

function registerPartial (partial) {
  Handlebars.registerPartial(partial.name, fs.readFileSync(partial.inPath, 'utf8'))
}

function compilePage (page) {
  var temp = Handlebars.compile(fs.readFileSync(page.inPath, 'utf8'))
  fs.writeFileSync(page.outPath, temp({}))
}

function compileAllPages () {
  var pageFiles = fs.readdirSync(PAGES_DIR)
        .map(nameToObj(PAGES_DIR))
  pageFiles.forEach(compilePage)
}


// For the Watchers
function incrementalPageBuild (filename) {
  console.log('Re-compiling page', filename)
  compilePage(nameToObj(PAGES_DIR)(filename))
}

function incrementalPartialBuild (filename) {
  console.log('Updating partial', filename)
  registerPartial(nameToObj(PARTIALS_DIR)(filename))
  console.log('Re-compiling all pages')
  compileAllPages()
}

// Where the magic happens
function main () {
  fs.removeSync(OUT_DIR)
  fs.mkdirSync(OUT_DIR)
  fs.copy('css', OUT_DIR + '/css')
  fs.copy('img', OUT_DIR + '/img')

  var partialFiles = fs.readdirSync(PARTIALS_DIR).map(nameToObj(PARTIALS_DIR))
  partialFiles.forEach(registerPartial)

  compileAllPages()

  var cliArgs = minimist(process.argv)
  if (!cliArgs.watch) return

  console.log('Watching...')
  var pageWatcher = fs.watch(PAGES_DIR)
  pageWatcher.on('change', (event, filename) => {
    if (event === 'change') {
      incrementalPageBuild(filename)
    }
  })

  var partialWatcher = fs.watch(PARTIALS_DIR)
  partialWatcher.on('change', (event, filename) => {
    if (event === 'change') {
      incrementalPartialBuild(filename)
    }
  })
}

// Execute the main function
main()
