#!/usr/bin/env node

import { run } from './run'

run().catch((error) => {
  console.error(error)
})
