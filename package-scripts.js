const germs = require(`germs`)
const pkg = require(`./package.json`)
const utils = require(`nps-utils`)

const built = [
  `del coverage`,
  `del lib`,
  `del docs`
]

const GERMS = germs.build(pkg.name, {
  test: `ava test.js`,
  readme: `echo "documentation readme -s API src/*.js"`,
  prepublishOnly: `nps care`,
  clean: utils.concurrent(built),
  scrub: utils.concurrent(built.concat([
    `del dependenc*`,
    `del yarn.lock`,
    `del node_modules`
  ]))
})

GERMS.scripts.lint.jsdoc = `echo "documentation lint"`

module.exports = GERMS
