import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// const { PORT } = process.env;
app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});
