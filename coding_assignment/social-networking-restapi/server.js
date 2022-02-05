var express = require('express');

var app = express();

const cors = require('cors');
const { default: axios } = require('axios');
var FormData = require('form-data');
app.use(cors());
app.use(express.json());

// this is just an example for how to do it with express
app.post('/register-token', function(req, res) {
    var data = new FormData();
    data.append('client_id', 'ju16a6m81mhid5ue1z3v2g0uh');
    data.append('name', 'name');
    data.append('email', 'email');
    var config = {
        method: 'post',
        url: 'https://api.supermetrics.com/assignment/register',
        headers: { 
            ...data.getHeaders()
        },
        data : data
    };

    axios(config).then(function (response) {
        res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
});

var port = process.env.PORT || 8080;
app.listen(port, function(){
    console.log('HTTP server is running at port ' + port + '!');
});