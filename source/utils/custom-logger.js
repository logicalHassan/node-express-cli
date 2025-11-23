const styles = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',

  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const symbols = {
  info: 'ℹ',
  success: '✔',
  warning: '⚠',
  error: '✖',
  arrow: '➜',
};

function style(text, color = '', weight = '') {
  return `${styles[weight] || ''}${styles[color] || ''}${text}${styles.reset}`;
}

export const log = {
  info(msg) {
    console.log(style(msg, 'blue'));
  },

  success(msg) {
    console.log(`${style(symbols.success, 'green', 'bold')} ${msg}`);
  },

  warn(msg) {
    console.log(`${style(symbols.warning, 'yellow', 'bold')} ${msg}`);
  },

  error(msg) {
    console.error(`${style(symbols.error, 'red', 'bold')} ${msg}`);
  },

  title(msg) {
    console.log(`${style(msg, 'cyan', 'bold')}`);
  },

  action(type, filePath) {
    const badges = {
      create: style('CREATE', 'green'),
      update: style('UPDATE', 'yellow'),
      skip: style('SKIP  ', 'gray'),
      error: style('ERROR ', 'red'),
    };

    const badge = badges[type.toLowerCase()] || type;
    console.log(` ${badge} ${filePath}`);
  },

  custom: style,
};
