const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = 3030;
const PUBLIC_DIR = path.resolve(__dirname, 'public')

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR);
}

const app = express();

app.use(cors());
app.use(express.static(PUBLIC_DIR));

app.get('/microfrontends', (_, res) => {
  let dataToResponse = [];

  const mfFolders = fs.readdirSync(PUBLIC_DIR);

  for (const mfFolder of mfFolders) {
    if (!fs.existsSync(path.resolve(PUBLIC_DIR, mfFolder, 'index.js'))) {
      continue;
    }

    const mfInfo = {
      name: mfFolder,
      src: `/${mfFolder}/index.js`,
      route: `/${mfFolder}`,
    }

    if (fs.existsSync(path.resolve(PUBLIC_DIR, mfFolder, 'index.css'))) {
      mfInfo.styles = `/${mfFolder}/index.css`;
    }

    dataToResponse.push(mfInfo);
  }

  res.json(dataToResponse);
});

console.log("Это тестовый сервер, выполняющий роль CDN");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});