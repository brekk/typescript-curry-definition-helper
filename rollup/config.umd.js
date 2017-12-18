const pkg = require(`../package.json`)
const buble = require(`rollup-plugin-buble`)
const commonjs = require(`rollup-plugin-commonjs`)
const resolve = require(`rollup-plugin-node-resolve`)
const json = require(`rollup-plugin-json`)
const {bundle} = require(`germs`)

const name = pkg.name.split(`/`)[1]

module.exports = bundle({
  name,
  alias: {
  },
  input: `src/index.js`,
  output: {
    name: `is-online`,
    file: `./${name}.js`,
    format: `umd`
  },
  alterPlugins: (plug) => {
    console.log(plug.map((x) => x.name))
    plug[2] = json({
      include: `node_modules/**`
    })
    plug[3] = commonjs({
      namedExports: {
        'is-online': [`isOnline`]
      }
    })
    plug[4] = buble({
      objectAssign: `Object.assign`,
      exclude: [`node_modules/**`]
    })
    plug[5] = resolve({
      jsnext: true,
      extensions: [`.js`, `.json`],
      main: true
    })
    console.log(plug.map((x) => x.name))
    return plug
  }
})
