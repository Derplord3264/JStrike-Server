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
			show: '[players, games] show connected players / running games',
			join: '[ID] join a game'
		}

		this.games = [
			{
				name: 'AWP India',
				map: 'awp_india',
				weapons: [
					'ak-47-kalashnikov'
				],
				pos: {x: 0, y: 85, z: 0}
			}
		];
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

	emitGame(client, game_id, data) {
		client.broadcast.to(game_id).emit(data.type, data.data);
	}

}

export let Server = new JStrike;
