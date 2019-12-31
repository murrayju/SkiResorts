// @flow
// Top level event logging

let registered = false;
const unhandledRejections = new Map();

const exitHandler = code => console.info(`Process exiting with code: ${code}`);
const warningHandler = error => console.warn(`Node<warning>: ${error?.message}`, error);
const uncaughtExceptionHandler = error => {
  console.error('Node<uncaughtException>', error);
  // Process must exit
  setImmediate(() => process.exit(1));
};
const multipleResolvesHandler = (type /* , promise, reason */) => {
  console.error('Node<multipleResolves>', { type /* , promise, reason */ });
  // exit recommended, but this may be a breaking change (let's see if it ever happens)
  // setImmediate(() => process.exit(1));
};
const unhandledRejectionHandler = (reason, promise) => {
  unhandledRejections.set(promise, reason);
  console.error('Node<unhandledRejection>', {
    promise,
    reason,
    count: unhandledRejections.size,
  });
};
const rejectionHandledHandler = promise => {
  unhandledRejections.delete(promise);
  console.info('Node<rejectionHandled>', {
    promise,
    count: unhandledRejections.size,
  });
};

export function handleNodeProcessEvents() {
  if (registered) {
    return;
  }
  process.on('exit', exitHandler);
  process.on('warning', warningHandler);
  process.on('uncaughtException', uncaughtExceptionHandler);
  process.on('multipleResolves', multipleResolvesHandler);
  process.on('unhandledRejection', unhandledRejectionHandler);
  process.on('rejectionHandled', rejectionHandledHandler);
  registered = true;
}

export function unregisterNodeProcessEvents() {
  if (!registered) {
    return;
  }
  process.off('exit', exitHandler);
  process.off('warning', warningHandler);
  process.off('uncaughtException', uncaughtExceptionHandler);
  process.off('multipleResolves', multipleResolvesHandler);
  process.off('unhandledRejection', unhandledRejectionHandler);
  process.off('rejectionHandled', rejectionHandledHandler);
  registered = false;
}
