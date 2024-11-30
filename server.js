const express = require('express');
const path = require('path');
const helmet = require('helmet'); 
const app = express();
const port = process.env.PORT || 4000;

app.use(helmet());  

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  
  app.get('/about-me', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'about-me.html'));
  });
  
  app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'projects.html'));
  });
  
  app.get('/resume', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'resume.html'));
  });
  
  app.use((req, res) => {
    res.status(404).send('Page not found');
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });