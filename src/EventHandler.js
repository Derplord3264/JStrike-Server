
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
		switch (data.cmd) {
			case 'join':
				this.server.emitShell(client, {
					type: 'exec',
					response: 'server responding to '+ data.argv[0]
				});
			break;
			case 'show':
				let str = `show: `;

				if (data.argv.length > 0) {
					switch (data.argv[0]) {
						case 'players':
							str += `${this.server.clients.length} connected players`;
						break;
						case 'games':
							str += `x running games`;
						break;
						default:
							str += `unknown argument '${data.argv[0]}'`
					}
				} else {
					str += `provide an argument to show`;
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
