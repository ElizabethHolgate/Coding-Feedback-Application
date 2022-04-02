const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('HELLO FROM CODING FEEDBACK APPLICATION')
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});