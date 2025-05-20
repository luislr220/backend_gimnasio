#!/bin/bash
npm uninstall bcrypt
npm install --build-from-source bcrypt
npm rebuild bcrypt --update-binarygi