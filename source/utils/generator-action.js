import fs from 'fs';
import path from 'path';

import { log } from './custom-logger.js';
import { smartInject } from './smart-inject.js';

export class GeneratorActions {
  constructor(projectRoot, verbose = true) {
    this.projectRoot = projectRoot;
    this.verbose = verbose;
  }

  createFile(relativePath, content) {
    const absPath = path.join(this.projectRoot, relativePath);
    const dir = path.dirname(absPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(absPath)) {
      if (this.verbose) log.action('SKIP', relativePath);
      return;
    }

    fs.writeFileSync(absPath, content, 'utf8');
    if (this.verbose) log.action('CREATE', relativePath);
  }

  updateFile(relativePath, modifications) {
    const absPath = path.join(this.projectRoot, relativePath);

    if (!fs.existsSync(absPath)) {
      if (this.verbose) log.action('ERROR', relativePath + ' (not found)');
      return;
    }

    const wasModified = smartInject(absPath, modifications);

    if (this.verbose) {
      if (wasModified) {
        log.action('UPDATE', relativePath);
      } else {
        log.action('SKIP', relativePath);
      }
    }
  }
}
