import Echo from 'laravel-echo';
import io from 'socket.io-client';
import env from '../../.env.json';

window.io = io;

const echo = new Echo({
  broadcaster: 'socket.io',
  host: env.LARAVEL_ECHO_SERVER_HOST,
});

export { echo };

