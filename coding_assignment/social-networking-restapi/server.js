var express = require('express');

var app = express();

const cors = require('cors');
const { default: axios } = require('axios');
app.use(cors());
app.use(express.json());

app.post('/register-token', function(req, res) {
    // var data = new FormData();
    // data.append('client_id', req.body[2]);
    // data.append('email', req.body[1]);
    // data.append('name', req.body[0]);
    axios.post('https://api.supermetrics.com/assignment/register', req.body).then(response => res.send(response));
});

var port = process.env.PORT || 8080;
app.listen(port, function(){
    console.log('HTTP server is running at port ' + port + '!');
});