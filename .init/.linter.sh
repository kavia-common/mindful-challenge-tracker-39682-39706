#!/bin/bash
cd /home/kavia/workspace/code-generation/mindful-challenge-tracker-39682-39706/main_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

