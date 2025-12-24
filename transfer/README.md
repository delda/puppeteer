# Hattrick Transfer Chart

Questo progetto visualizza il grafico dei trasferimenti di Hattrick utilizzando Google Firebase Hosting.

## Prerequisiti

È necessario avere installato [Node.js](https://nodejs.org/) (versione recente) e la CLI di Firebase.

Se non hai ancora installato la CLI di Firebase:

```bash
npm install -g firebase-tools
```

Effettua il login:

```bash
firebase login
```

## Prima Installazione / Deploy

1. Offusca il file dei dati:
   ```bash
   node obfuscate.js
   ```
   Questo comando crea `transferNumber.dat` da `transferNumber.json`.

2. Minifica il file JavaScript:
   ```bash
   npx uglify-es transfer_graph.js -o transfer_graph.min.js -c -m
   ```
   Questo comando crea una versione compatta e difficile da leggere del codice (`transfer_graph.min.js`).

3. Pubblica su Firebase:
   ```bash
   firebase deploy
   ```

Il grafico sarà visibile a: https://hattrick-50b4e.web.app/transfer_graph.html

## Aggiornare i dati

Quando hai un nuovo `transferNumber.json`, ripeti i passi di offuscamento e deploy:

1. `node obfuscate.js`
2. `firebase deploy --only hosting`

Se modifichi il codice JavaScript (`transfer_graph.js`), ricordati di rieseguire anche il comando di minificazione prima del deploy.
