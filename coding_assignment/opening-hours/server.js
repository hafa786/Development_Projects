data = {
    "friday": [
            {
            "type": "open",
            "value": 64800
        }
    ],
    "saturday": [
        {
            "type": "close",
            "value": 3600
        },
        {
            "type": "open",
            "value": 32400
        },
        {
            "type": "close",
            "value": 39600
        },
        {
            "type": "open",
            "value": 57600
        },
        {
            "type": "close",
            "value": 82800
        }
    ]
};


var express =  require('express');
var app = express();

const cors = require("cors");
app.use(cors())
app.use(express.json());

app.post('/fetch-data', function (res, res){
    res.send(data);
});

var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
