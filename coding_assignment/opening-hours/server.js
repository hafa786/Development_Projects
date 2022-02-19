data = {
	'friday': [
		{
			'type': 'open',
			'value': 64800
		}
	],
	'saturday': [
		{
			'type': 'close',
			'value': 3600
		},
		{
			'type': 'open',
			'value': 32400
		},
		{
			'type': 'close',
			'value': 39600
		},
		{
			'type': 'open',
			'value': 57600
		},
		{
			'type': 'close',
			'value': 82800
		}
	],
};

data2 = {
	'monday': [],
	'tuesday': [
		{ 'type': 'open', 'value': 36000 },
		{ 'type': 'close', 'value': 64800 }
	],
	'wednesday': [],
	'thursday': [
		{ 'type': 'open', 'value': 36000 },
		{ 'type': 'close', 'value': 64800 }
	],
	'friday': [{ 'type': 'open', 'value': 36000 }],
	'saturday': [
		{ 'type': 'close', 'value': 3600 },
		{ 'type': 'open', 'value': 36000 }
	],
	'sunday': [
		{ 'type': 'close', 'value': 3600 },
		{ 'type': 'open', 'value': 43200 },
		{ 'type': 'close', 'value': 75600 }
	]
}

var express =  require('express');
var app = express();

const cors = require('cors');
app.use(cors())
app.use(express.json());

app.post('/fetch-data', function (res, res){
	res.send(data2);
});

var port = process.env.PORT || 8080;

app.listen(port, function () {
	console.log('Example app listening on port ' + port + '!');
});
