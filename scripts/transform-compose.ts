#!/usr/bin/env bun

import { join } from 'node:path'

const composePath = join(import.meta.dir, '..', 'template', 'compose.yml')
const composeFile = Bun.file(composePath)
const composeContent = await composeFile.text()

const transformed
  = composeContent
    .replaceAll('working_dir: /code', 'working_dir: /code/template')
    .replaceAll('.docker', 'template/.docker')

await Bun.write(Bun.stdout, transformed)
