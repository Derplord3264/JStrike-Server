import http from 'http';
import SocketIO from 'socket.io';

let server = http.Server();
let io = new SocketIO(server);
io.set('origins', 'http://localhost:9000/');
let port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log('Server listening on port *:%d', port);
});

let players = [];

io.on('connection', (id, socket) => {
	console.log(socket);

	socket.on('shell', (data) => {
		
	});
});