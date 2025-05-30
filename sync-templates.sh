#!/bin/bash

set -e

TEMPLATES_DIR="./templates"
REPOS=(
  "https://github.com/logicalHassan/nodets-express-boilerplate.git"
  "https://github.com/logicalHassan/node-express-boilerplate.git"
  "https://github.com/logicalHassan/express-postgres-prisma.git"
)

# Clean current templates
rm -rf $TEMPLATES_DIR
mkdir -p $TEMPLATES_DIR

for REPO in "${REPOS[@]}"; do
  NAME=$(basename "$REPO" .git)
  echo "Cloning $NAME..."
  git clone --depth 1 "$REPO" "$TEMPLATES_DIR/$NAME"
  rm -rf "$TEMPLATES_DIR/$NAME/.git"
done

echo "✅ Templates updated!"
