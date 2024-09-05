class EventHandler {

	constructor(server) {
		this.server = server;
	}

	initClient(client) {
		this.server.clients.push(client.id);

		this.server.emitShell(client, {
			type: 'init',
			cmd: this.server.cmd
		});

		client.on('disconnecting', () => this.onDisconnecting(client));
		client.on('shell', (data) => this.onShell(client, data));
		client.on('move', (data) => this.onMove(client, data));

		console.log(`Client connected (total ${this.server.clients.length})`);
	}

	onDisconnecting(client) {
		const game_id = Object.keys(client.rooms)[0];
		const dc_client = this.server.clients.indexOf(client.id);

		this.server.io.sockets.in(game_id).emit('disconnecting', client.id);
		this.server.clients.splice(dc_client, 1);

		console.log(`Client disconnected`);
	}

	onShell(client, data) {
		let str = ``;

		switch (data.cmd) {
			case 'show':
				if (data.argv.length > 0) {
					switch (data.argv[0]) {
						case 'players':
							str += `show: ${this.server.clients.length} connected players`;
						break;
						case 'games':
							for (const i in this.server.games) {
								const game = this.server.games[i];

								str += `\n|| ${i} || ${game.name} || ${game.map} ||`;
							}
						break;
						default:
							str += `show: unknown argument '${data.argv[0]}'`
					}
				} else {
					str += `show: provide an argument to show`;
				}

				this.server.emitShell(client, {
					type: 'exec',
					response: str
				});
			break;
			case 'join':
				if (data.argv.length > 0) {
					const game_id = parseInt(data.argv[0]);

					/* Valid game ID */
					if (game_id >= 0 && game_id < this.server.games.length) {

						/* Join client to game */
						client.join(game_id);
						client.pos = this.server.games[game_id].pos;

						/* Send game info to client */
						const sioRoom = this.server.io.sockets.adapter.rooms[game_id];
						if(sioRoom) { 
							console.log(sioRoom.sockets);
						}
						this.server.emitShell(client, {
							type: 'join',
							response: {
								config: this.server.games[game_id],
								enemies: null
							}
						});

						/* Broadcast to game room about new player */
						this.server.emitGame(client, game_id, {
							type: 'join',
							data: {
								id: client.id,
								pos: client.pos
							}
						});

					} else {
						str += `join: invalid game id '${data.argv[0]}'`;
					}
				} else {
					str += `join: provide a game ID to join`;
				}

				this.server.emitShell(client, {
					type: 'exec',
					response: str
				});
			break;
			default:
				this.server.emitShell(client, {
					type: 'exec',
					response: `Unknown command: ${data.cmd}`
				});
		}
	}

	onMove(client, data) {
		const game_id = Object.keys(client.rooms)[0];

		this.server.emitGame(client, game_id, {
			type: 'move',
			data: {
				id: client.id,
				pos: data.pos,
				vel: data.vel
			}
		});
	}
}

export default EventHandler;
