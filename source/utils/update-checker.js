import https from 'https';

export function checkForUpdates(pkg) {
  return new Promise((resolve) => {
    const req = https.get(`https://registry.npmjs.org/${pkg.name}/latest`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const latestVersion = JSON.parse(data).version;
          if (latestVersion && latestVersion !== pkg.version) {
            const versionColored = `\x1b[31m${pkg.version}\x1b[33m`;
            const latestColored = `\x1b[32m${latestVersion}\x1b[33m`;
            const cmdColored = `\x1b[36mnpm i -g ${pkg.name}\x1b[33m`;

            const lines = [
              `   Update available! ${versionColored} → ${latestColored}`,
              `   Run ${cmdColored} to update`,
            ];

            const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');
            const width = Math.max(...lines.map((line) => stripAnsi(line).length)) + 2;

            const top = `\x1b[33m╭${'─'.repeat(width)}╮`;
            const bottom = `╰${'─'.repeat(width)}╯`;
            const middle = lines
              .map((line) => {
                const padding = ' '.repeat(width - stripAnsi(line).length);
                return `│${line}${padding}│`;
              })
              .join('\n');

            console.log(`\n${top}\n${middle}\n${bottom}\x1b[0m\n`);
          }
          resolve();
        } catch (error) {
          console.log(error);
          resolve();
        }
      });
    });

    req.on('error', () => resolve());
    req.setTimeout(1000, () => {
      req.destroy();
      resolve();
    });
  });
}
