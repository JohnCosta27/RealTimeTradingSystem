# Integration Testing

Testing how the entire backend works together. Specially the Hub and Brain systems as they are quite dependent on one another.

## How to use it

I have used Node.js with Jest and Supertest because they are some of the nicest testing frameworks I have used.

- pnpm install
- pnpm test:watch

## Technicalities

During this testing I make use of a function in Jest called `toMatchInlineSnapshot`, which takes the result of the test, and generates a string from the result, and every subsequent test must match that string, otherwise it will fail the test. The only bad thing about this is that it generates fairly ugly strings which don't format very nicely.
