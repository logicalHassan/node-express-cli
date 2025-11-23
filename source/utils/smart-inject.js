import fs from 'fs';
import path from 'path';

export function smartInject(filePath, modifications) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  modifications.forEach(({ type, text, anchors, location }) => {
    if (content.includes(text.trim())) return;

    if (type === 'import') {
      const importRegex = /^(import .* from .*;|const .* = require\(.*\);)/gm;
      const matches = [...content.matchAll(importRegex)];

      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const insertPos = lastMatch.index + lastMatch[0].length;
        content = content.slice(0, insertPos) + '\n' + text + content.slice(insertPos);
        modified = true;
      } else {
        content = text + '\n' + content;
        modified = true;
      }
    } else if (type === 'inject') {
      const potentialAnchors = Array.isArray(anchors) ? anchors : [anchors];
      const matchedAnchor = potentialAnchors.find((a) => content.includes(a));

      if (matchedAnchor) {
        const anchorIndex = content.indexOf(matchedAnchor);

        const lastNewLine = content.lastIndexOf('\n', anchorIndex);
        const lineStartIndex = lastNewLine === -1 ? 0 : lastNewLine + 1;

        const lineContent = content.slice(lineStartIndex);
        const indentMatch = lineContent.match(/^[\t ]*/);
        const currentIndent = indentMatch ? indentMatch[0] : '';

        if (location === 'after') {
          const insertPos = anchorIndex + matchedAnchor.length;
          content = content.slice(0, insertPos) + '\n' + currentIndent + text + content.slice(insertPos);
          modified = true;
        } else if (location === 'before') {
          content = content.slice(0, anchorIndex) + text + '\n' + currentIndent + content.slice(anchorIndex);
          modified = true;
        }
      } else {
        console.warn(`⚠️ Could not find any valid anchor in ${path.basename(filePath)}`);
      }
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return modified;
}
