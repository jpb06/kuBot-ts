import * as debug from 'debug';
import * as express from 'express';
import * as path from 'path';

import homeRoute from './routes/home.route';
import guildConfigRoute from './routes/guild.config.route';

import handleErrors from './app.error.handler';

var app = express();

console.log('dir:',__dirname);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/../static'));
app.use('/bootstrap', express.static(__dirname + '/../node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/../node_modules/jquery/dist'));
app.use('/materialdesignicons', express.static(__dirname + '/../node_modules/material-design-icons/iconfont'));

app.use('/', homeRoute);
app.use('/guildconfig', guildConfigRoute);

handleErrors(app);

app.set('port', /*process.env.PORT ||*/ 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
