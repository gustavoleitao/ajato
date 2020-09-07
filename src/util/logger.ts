import winston, { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format;

const newformat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}] : ${message}`;
});

const logger = createLogger({
  level: process.env.LOGGER_LEVEL || 'debug',
  format: combine(
    format.splat(),
    timestamp(),
    newformat
  ),
  transports: [
    new transports.Console()
  ]
});

export = logger;

