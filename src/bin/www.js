/**
 * Module dependencies.
 */
import debug from 'debug';
import http from 'http'; // const server = http.createServer(app);
import app from '../app.js';
/**
 * Normalize a port into a number, string, or fal se.
 */
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/**
 * Create HTTP server.
 */
const server = http.createServer(app);
/**
 * Event listener for HTTP server "error" event.
 */
const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    // eslint-disable-next-line no-console
    console.log(`${bind} requires elevated privileges`);
    process.exit(1);
    break;
  case 'EADDRINUSE':
    // eslint-disable-next-line no-console
    console.log(`${bind} is already in use`);
    process.exit(1);
    break;
  default:
    throw error;
  }
};
/**
 * event listener for HTTP server "listening" event
 * outputs the port the server is listening on to the console
 *
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
