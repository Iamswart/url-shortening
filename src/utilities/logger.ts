import winston from 'winston';
require('winston-papertrail').Papertrail;

const winstonTransports: any = winston.transports;

const transports = [
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    silent: process.env.NODE_ENV === 'test',
  }),
  new winston.transports.File({
    filename: 'logs/combined.log',
    silent: process.env.NODE_ENV === 'test',
  }),
];

if (process.env.NODE_ENV === 'production') {
  const winstonPapertrail = new winstonTransports.Papertrail({
    host: 'logs.papertrailapp.com',
    port: 20113,
  });

  winstonPapertrail.on('error', function (err: any) {
    console.log('PAPERTRAIL CONNECTION ERROR', err);
  });

  transports.push(winstonPapertrail);
}

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
  ),
  transports,
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
