const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = 3030;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const MF_DIR = path.resolve(__dirname, 'microfrontends');
const MF_FILENAME = 'data.json';

const checkAndCreateMFDirectory = () => {
  if (!fs.existsSync(MF_DIR)) {
    fs.mkdirSync(MF_DIR);

    if (!fs.existsSync(path.resolve(MF_DIR, MF_FILENAME))) {
      fs.writeFileSync(path.resolve(MF_DIR, MF_FILENAME), JSON.stringify([]));
    }
  }
}

app.get('/microfrontends', (_, res) => {
  let dataToResponse = [];

  checkAndCreateMFDirectory();
  dataToResponse = JSON.parse(fs.readFileSync(path.resolve(MF_DIR, MF_FILENAME)));

  res.json(dataToResponse);
});

// Захардожено, по идее такой запрос должен делаться к бэку SIMuRG
app.get('/available-microfrontends', (_, res) => {
  res.json([{ name: 'rinex-to-csv', status: 'active' }, { name: 'navi', status: 'active' }]);
});

app.post('/link-microfrontend', (req, res) => {
  checkAndCreateMFDirectory();
  const data = req.body;

  try {
    const mfArray = JSON.parse(fs.readFileSync(path.resolve(MF_DIR, MF_FILENAME)));
    const index = mfArray.findIndex((mfObject) => mfObject.name === data.name);

    if (index >= 0) {
      mfArray[index] = data
    } else {
      mfArray.push(data);
    }

    fs.writeFileSync(path.resolve(MF_DIR, MF_FILENAME), JSON.stringify(mfArray));

    res.status(200);
  } catch (e) {
    res.status(400);
  } finally {
    res.send();
  }
});

app.delete('/delink-microfrontend/:mfName', (req, res) => {
  checkAndCreateMFDirectory();

  const { mfName } = req.params;

  const mfArray = JSON.parse(fs.readFileSync(path.resolve(MF_DIR, MF_FILENAME)));

  const index = mfArray.findIndex((mfObject) => mfObject.name === mfName);
  if (index >= 0) {
    mfArray.splice(index, 1);

    fs.writeFileSync(path.resolve(MF_DIR, MF_FILENAME), JSON.stringify(mfArray));
    res.status(200);
  } else {
    res.status(204)
  }

  res.send();
});

console.log("Это тестовый сервер, выполняющий роль CDN");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});