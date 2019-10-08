const { BootlegPromise, states } = require('./promise');

describe('Bootleg Promise', () => {
  const delay = milliseconds => new BootlegPromise(resolve => setTimeout(resolve, milliseconds));

  it('should be defined', () => {
    expect(new BootlegPromise()).toBeDefined();
    expect(BootlegPromise.resolve).toBeDefined();
    expect(BootlegPromise.reject).toBeDefined();
    expect(BootlegPromise.try).toBeDefined();
  });

  it('should succesfully resolve', () => {
    let promise = new BootlegPromise((resolve) => resolve(42));
    expect(promise.value).toEqual(42);
    expect(promise['state']).toEqual(states.resolved);

    promise = BootlegPromise.resolve(42);
    expect(promise.value).toEqual(42);
    expect(promise['state']).toEqual(states.resolved);
  });

  it('should succesfully reject', () => {
    let promise = new BootlegPromise((_, reject) => reject(42));
    expect(promise.value).toEqual(42);
    expect(promise['state']).toEqual(states.rejected);

    promise = BootlegPromise.reject(42);
    expect(promise.value).toEqual(42);
    expect(promise['state']).toEqual(states.rejected);

    expect(() => new BootlegPromise(_ => { throw new Error('error') })).not.toThrowError();
  });

  it('should chain thens as expected', () => {
    let promise = BootlegPromise.reject(42)
      .then(() => 10)
      .then(() => 11);
    
    expect(promise.value).toEqual(42);
    expect(promise['state']).toEqual(states.rejected);

    promise = BootlegPromise.resolve(42)
      .then(() => 10)
      .then(() => 11);
    
    expect(promise.value).toEqual(11);
    expect(promise['state']).toEqual(states.resolved);
  });

  it('should chain catches as expected', () => {
    let promise = BootlegPromise.reject(42)
      .catch((value) => value);

    expect(promise.value).toEqual(42);
    expect(promise['state']).toEqual(states.resolved);

    promise = BootlegPromise.reject(42)
      .catch((value) => value)
      .then(() => 11);
    
    expect(promise.value).toEqual(11);
    expect(promise['state']).toEqual(states.resolved);
  });

  it('should ignore subsequent calls to resolve and reject', () => {
    const promise = new BootlegPromise((resolve, reject) => {
      resolve(42);
      reject(11);
      resolve();
    });

    expect(promise.value).toEqual(42);
    expect(promise['state']).toEqual(states.resolved);
  });

  it('SPECIAL CASES', () => {
    expect(() => BootlegPromise.resolve(42).then(() => { throw new Error(); })).not.toThrowError();

    expect(BootlegPromise.reject(BootlegPromise.resolve(42)).value.value).toEqual(42);
    expect(BootlegPromise.reject(BootlegPromise.resolve(42)).value['state']).toEqual(states.resolved);
  });

  it('should work with async', (done) => {
    delay(100).then(() => 42).then((value) => {
      expect(value).toEqual(42);
      done();
    });
  });
});