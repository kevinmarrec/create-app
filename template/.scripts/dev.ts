import concurrently, { type ConcurrentlyCommandInput } from 'concurrently'

const commandInputs: ConcurrentlyCommandInput[] = [
  { name: 'api', command: `bun --cwd api dev | pino-pretty`, prefixColor: 'blue' },
  { name: 'app', command: `bun --cwd app dev`, prefixColor: 'green' },
]

concurrently(commandInputs)
