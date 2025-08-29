import { beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  return {
    run: vi.fn(async () => {}),
  }
})

vi.mock('../src/run', () => ({
  run: mocks.run,
}))

beforeEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
})

it('should call run and not log error if resolved', async () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  await import('../src/index')
  expect(mocks.run).toHaveBeenCalled()
  expect(errorSpy).not.toHaveBeenCalled()
})

it('should call run and log error if rejected', async () => {
  const error = new Error('fail')
  mocks.run.mockRejectedValueOnce(error)
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  await import('../src/index')
  expect(mocks.run).toHaveBeenCalled()
  expect(errorSpy).toHaveBeenCalledWith(error)
})
