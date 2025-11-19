export function showHelp(pkg) {
  console.log(`
  \x1b[36m${pkg.name}\x1b[0m v${pkg.version}
  ${pkg.description || 'The unopinionated boilerplate generator'}

  \x1b[33mUsage:\x1b[0m
    $ npx get-express-starter [options]

  \x1b[33mOptions:\x1b[0m
    -v, --version    Display current version
    -h, --help       Display this message

  \x1b[33mExamples:\x1b[0m
    $ npx get-express-starter
    $ npx get-express-starter --version
`);
  process.exit(0);
}
