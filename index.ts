import { httpServer } from './src/http_server/index';
import { HTTP_PORT } from './src/constants/constants';
import './src/ws_server/index';

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
