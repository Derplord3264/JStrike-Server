
class EventHandler {

	constructor(server) {
		this.server = server;
	}

	initClient(client) {
		this.server.clients.push(client);

		this.server.emitShell(client, {
			type: 'init',
			cmd: this.server.cmd
		});

		client.on('disconnect', (data) => this.onDisconnect(client));
		client.on('shell', (data) => this.onShell(client, data));

		console.log(`Client connected (total ${this.server.clients.length})`);
	}

	onDisconnect(client) {
		let dc_client = this.server.clients.indexOf(client);
		this.server.clients.splice(dc_client, 1);

		console.log(`Client disconnected (total ${this.server.clients.length})`);
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
							for (let i in this.server.games) {
								let game = this.server.games[i];

								str += `\n${i}\t${game.name}\t${game.map}`;
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
					let game_id = parseInt(data.argv[0]);

					if (game_id >= 0 && game_id < this.server.games.length) {

						client.join(game_id);
						
						this.server.emitShell(client, {
							type: 'join',
							response: this.server.games[game_id]
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
}

export default EventHandler;
