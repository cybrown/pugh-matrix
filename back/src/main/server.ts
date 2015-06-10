import * as express from 'express';
import routes from './config/routes';
import * as bodyParser from 'body-parser';

var app = express();

console.log('Configuration du serveur...');
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

routes(app);

if (process.env.RUN_SERVER) {
	app.listen(app.get('port'));
	app.use(express.static(process.env.BASE));
}

export = app;
