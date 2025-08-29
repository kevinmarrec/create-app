import pino from 'pino'

import { level } from './config/logger'

export const logger = pino({
  level,
  base: {},
})

export type Logger = typeof logger
