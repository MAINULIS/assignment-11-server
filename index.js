const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express());

app.get("/", (req, res) => {
    res.send('assignment submission is pending')
})


app.listen(port, () => {
    console.log(`assignment code is running on ${port}`)
});