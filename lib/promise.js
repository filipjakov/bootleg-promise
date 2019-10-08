const states = {
  pending: 'Pending',
  resolved: 'Resolved',
  rejected: 'Rejected'
};

class BootlegPromise {
  constructor(executor) {
    // Async support
    const laterCalls = [];
    const callLater = getMember => cb => new BootlegPromise(resolve => laterCalls.push(() => resolve(getMember()(cb))));
    
    // Special case -> https://github.com/tc39/proposal-promise-try/blob/master/polyfill.js#L12
    const tryCall = cb => BootlegPromise.try(() => cb(this.value));

    const members = {
      [states.resolved]: {
        state: states.resolved,
        then: tryCall,
        catch: _ => this
      },
      [states.rejected]: {
        state: states.rejected,
        then: _ => this,
        catch: tryCall
      },
      [states.pending]: {
        state: states.pending,
        then: callLater(() => this.then),
        catch: callLater(() => this.catch)
      }
    };

    // Override the current class behaviour regarding the state provided
    const changeState = state => Object.assign(this, members[state]);

    const apply = (value, state) => {
      // Ignoring subsequent calls to resolve and reject
      if (this.state === states.pending) {
        this.value = value;
        changeState(state);

        // Code knows how to handle then and catch on a resolved or rejected state,
        // just need to hold up until the state arrives there. 
        for (const laterCall of laterCalls) {
          laterCall();
        }
      }
    }

    const getCallback = state => value => {
      // Unpack on resolve
      if (value instanceof BootlegPromise && state === states.resolved) {
        value.then(value => apply(value, states.resolved));
        value.catch(value => apply(value, states.rejected));
      } else {
        apply(value, state);
      }
    };
    
    // Define resolve and reject
    const resolve = getCallback(states.resolved);
    const reject = getCallback(states.rejected);

    // Set the current state to pending
    changeState(states.pending);

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  static resolve(value) {
    return new BootlegPromise(resolve => resolve(value));
  }

  static reject(value) {
    return new BootlegPromise((_, reject) => reject(value));
  }

  static try(cb) {
    return new BootlegPromise(resolve => resolve(cb()));
  }
}


module.exports = {
  BootlegPromise, states
};
