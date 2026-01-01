# Transfer Chart

This project visualizes the transfer chart using Google Firebase Hosting.

## Prerequisites

You need to have [Node.js](https://nodejs.org/) (recent version) and the Firebase CLI installed.

If you haven't installed the Firebase CLI yet:

```bash
npm install -g firebase-tools
```

Log in:

```bash
firebase login
```

## First Installation / Deploy

1. Obfuscate the data file:
   ```bash
   node obfuscate.js
   ```
   This command creates `transferNumber.dat` from `transferNumber.json`.

2. Minify the JavaScript file:
   ```bash
   npx uglify-es transfer_graph.js -o transfer_graph.min.js -c -m
   ```
   This command creates a compact and hard-to-read version of the code (`transfer_graph.min.js`).

3. Publish to Firebase:
   ```bash
   cd transfer
   firebase deploy
   ```

The chart will be visible at Hosting URL indicated.

## Updating Data

When you have a new `transferNumber.json`, repeat the obfuscation and deploy steps:

`cd transfer`
1. `node obfuscate.js`
2. `npx uglify-es transfer_graph.js -o transfer_graph.min.js -c -m`
3. `firebase deploy --only hosting`

If you modify the JavaScript code (`transfer_graph.js`), remember to re-run the minification command before deploying.

## Development

To develop the graph, you can use the Firebase development server:

```bash
firebase serve
```

This command starts a local server and the graph will be visible at: http://localhost:5000/transfer_graph.html
