import getText from '../src/index'

describe('getText', () => {
  it('getText() === "hello world"', () => {
    const text = getText()
    expect(text).toBe('hello world')
  })
})
