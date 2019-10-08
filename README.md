# @fbulic/promise

Pure Lightweight JS implementation of the basic Promise API

# Instalation

```sh
$ npm i @fbulic/promise
```

# Usage

It supports the basic features of your good ol' [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API:

```javascript
const { BootlegPromise } = require('@fbulic/promise');

const p = BootlegPromise.reject(42)
    .catch(value => value) // resolves
    .catch(anything) // ignored
    .then(value => console.log(value)) // logs 42
    .then(() => { throw new Error() })
    .catch(() => 24); // resolves
```

It even has support for wrapping async tasks 🔮🔮🔮:

```javascript
const { BootlegPromise } = require('@fbulic/promise');

const delay = milliseconds => new BootlegPromise(resolve => setTimeout(resolve, milliseconds));
const logThenDelay = milliseconds => total => {
    console.log(`${total} ms!`);
    return delay(milliseconds).then(() => total + milliseconds);
};

logThenDelay(500)(0)          // logs 0 ms!
    .then(logThenDelay(500))  // after 500 ms, logs 500 ms!
    .then(logThenDelay(500))  // after 1000 ms, logs 1000 ms!
```

And all that in just a couple of lines of code! 🔥🔥🔥

# Tests

You can run tests in either watch mode (`npm run tests:watch`) or a simple pass (`npm run tests`)!

# Notes

The pure intention of this library is/was to learn the internals of the Promise API and to succesfully publish a (scoped) npm package

# TODO

- [ ] BootlegPromise.all()
- [ ] BootlegPromise.allSettled()
- [x] BootlegPromise.prototype.catch()
- [ ] BootlegPromise.prototype.finally()
- [x] BootlegPromise.prototype.then()
- [ ] BootlegPromise.race()
- [x] BootlegPromise.reject()
- [x] BootlegPromise.resolve()