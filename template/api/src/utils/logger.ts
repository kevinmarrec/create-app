import pino from 'pino'

import { env } from '../env'

export const logger = pino({
  level: env.log.level,
  base: {},
})

export type Logger = typeof logger
