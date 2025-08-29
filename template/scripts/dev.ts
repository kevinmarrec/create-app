import concurrently, { type ConcurrentlyCommandInput } from 'concurrently'

const commandInputs: ConcurrentlyCommandInput[] = [
  { name: 'backend', command: `bun --cwd backend dev | pino-pretty`, prefixColor: 'blue' },
  { name: 'frontend', command: `bun --cwd frontend dev`, prefixColor: 'green' },
]

concurrently(commandInputs)
