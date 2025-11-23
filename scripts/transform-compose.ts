#!/usr/bin/env bun

import { join } from 'node:path'

const composePath = join(import.meta.dir, '..', 'template', 'compose.yaml')
const file = Bun.file(composePath)
const composeContent = await file.text()

// Transform the compose.yaml for playground usage
let transformed = composeContent

// 1. Change working_dir from /code to /code/template (in x-common anchor)
transformed = transformed.replace(
  /working_dir: \/code$/m,
  'working_dir: /code/template',
)

// 2. Change traefik volume paths to include template/ prefix
transformed = transformed.replace(
  /- \.\/\.docker\//g,
  '- ./template/.docker/',
)

// Output the transformed content to stdout
await Bun.write(Bun.stdout, transformed)
