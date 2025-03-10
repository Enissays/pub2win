interface Immediate {
  _idleNext: Immediate | null;
  _idlePrev: Immediate | null;
  _onImmediate: Function;
  _argv: any[];
  _destroyed: boolean;
}

if (typeof global.setImmediate === 'undefined') {
  const setImmediatePolyfill = function(callback: Function, ...args: any[]): Immediate {
    const id = setTimeout(() => callback(...args), 0) as unknown as Immediate;
    return id;
  };

  setImmediatePolyfill.__promisify__ = function<T>(): Promise<T> {
    return new Promise((resolve) => {
      setImmediatePolyfill(() => resolve(undefined as unknown as T));
    });
  };
  
  global.setImmediate = setImmediatePolyfill as unknown as typeof global.setImmediate;
}

if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = function(immediateId: Immediate | undefined): void {
    if (immediateId !== undefined) {
      clearTimeout(immediateId as unknown as number);
    }
  } as unknown as typeof global.clearImmediate;
}

export {};