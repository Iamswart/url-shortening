import * as http from "http";
import app from "./app";
import logger from "./utilities/logger";
import db from './database/database';
import appConfig from "./config/env";

function normalizePort(val: any): any {
  const port = Number(val);

  if (Number.isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

const port = normalizePort(appConfig.port);

app.set("port", port);

const server = http.createServer(app);

function onError(error: any): any {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind =
    addr === null
      ? `port ${port}`
      : typeof addr === "string"
      ? `pipe ${addr}`
      : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
}

server.on("error", onError);
server.on("listening", onListening);

db.sequelize.authenticate().then(() => {
  logger.info('Database connection successful');
});

server.listen(port);

export default server;
