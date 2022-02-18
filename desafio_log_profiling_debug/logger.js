import winston from 'winston';
let {combine,timestamp,json} = winston.format;
let LEVEL = Symbol.for('level');

let filterOnly=(level) =>{
  return winston.format(info =>{
    if (info[LEVEL] === level)
      return info
  })()
};

export let createLogger=() =>{
  return winston.createLogger({
    format:combine(
      timestamp(),
      json()
    ),
    transports:[
      new winston.transports.Console({level:'info'}),
      new winston.transports.File({filename:'./logs/warn.log',format:filterOnly('warn')}),
      new winston.transports.File({filename:'./logs/error.log',format:filterOnly('error')})
    ]
  });
};