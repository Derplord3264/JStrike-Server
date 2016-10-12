import http from 'http';
import SocketIO from 'socket.io';
import EventHandler from './EventHandler';

class JStrike {

	constructor() {

		this.server = http.Server();
		this.io = new SocketIO(this.server);
		this.port = process.env.PORT || 3000;
		this.eventHandler = new EventHandler(this);
		this.clients = [];

		this.cmd = {
			show: '[players] show connected players, [games] show running games',
			join: 'join a game'
		}
	}

	start() {

		/* Start HTTP server */
		this.server.listen(this.port, () => {
			console.log('Server listening on port *:%d', this.port);
		});

		/* Init socket listeners */
		this.io.on('connection', (client) => {
			this.eventHandler.initClient(client);
		});
	}

	emitShell(client, data) {
		client.emit('shell', data);
	}

}

export let Server = new JStrike;
