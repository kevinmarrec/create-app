import concurrently, { type ConcurrentlyCommandInput } from 'concurrently'

const commandInputs: ConcurrentlyCommandInput[] = [
  { name: 'server', command: `bun --cwd server dev | pino-pretty`, prefixColor: 'blue' },
  { name: 'client', command: `bun --cwd client dev`, prefixColor: 'green' },
]

concurrently(commandInputs)
