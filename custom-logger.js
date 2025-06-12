const styles = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  italic: '\x1b[3m',

  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function style(text, color = '', weight = '') {
  return `${styles[weight] || ''}${styles[color] || ''}${text}${styles.reset}`;
}

export const log = {
  info(msg) {
    console.log(style(msg, 'cyan'));
  },
  success(msg) {
    console.log(style(msg, 'green', 'bold'));
  },
  warn(msg) {
    console.log(style(msg, 'yellow', 'bold'));
  },
  error(msg) {
    console.error(style(msg, 'red', 'bold'));
  },
  title(msg) {
    console.log(style(msg, 'cyan', 'bold'));
  },
  custom(msg, color = '', weight = '') {
    console.log(style(msg, color, weight));
  },
};
