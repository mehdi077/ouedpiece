#!/bin/bash

# Check if a path argument is provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide a file or folder path"
    echo "Usage: bash ship.sh <path>"
    exit 1
fi

# Get the source path from argument
SOURCE_PATH="$1"
VPS_HOST="root@64.227.46.73"
VPS_DIR="ouedpiece"

# Check if the source path exists
if [ ! -e "$SOURCE_PATH" ]; then
    echo "Error: Source path '$SOURCE_PATH' does not exist"
    exit 1
fi

# Remove leading ./ or / from the path if present
CLEAN_PATH=$(echo "$SOURCE_PATH" | sed 's|^./||' | sed 's|^/||')

echo "Shipping '$CLEAN_PATH' to VPS..."

# Use scp to copy the file/folder to VPS
if scp -r "$SOURCE_PATH" "${VPS_HOST}:${VPS_DIR}/${CLEAN_PATH}"; then
    echo "✅ Successfully shipped '$CLEAN_PATH' to VPS"
else
    echo "❌ Failed to ship '$CLEAN_PATH' to VPS"
    exit 1
fi
