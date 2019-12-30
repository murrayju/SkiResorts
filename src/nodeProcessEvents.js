// @flow

let registered = false;
export default function handleNodeProcessEvents() {
  if (registered) {
    return;
  }
  // Top level event logging
  process.on('exit', code => console.info(`Process exiting with code: ${code}`));
  process.on('warning', error => console.warn(`Node<warning>: ${error?.message}`, error));
  process.on('uncaughtException', error => {
    console.error('Node<uncaughtException>', error);
    // Process must exit
    setImmediate(() => process.exit(1));
  });
  process.on('multipleResolves', (type, promise, reason) => {
    console.error('Node<multipleResolves>', { type, promise, reason });
    // exit recommended, but this may be a breaking change (let's see if it ever happens)
    // setImmediate(() => process.exit(1));
  });
  const unhandledRejections = new Map();
  process.on('unhandledRejection', (reason, promise) => {
    unhandledRejections.set(promise, reason);
    console.error('Node<unhandledRejection>', {
      promise,
      reason,
      count: unhandledRejections.size,
    });
  });
  process.on('rejectionHandled', promise => {
    unhandledRejections.delete(promise);
    console.info('Node<rejectionHandled>', {
      promise,
      count: unhandledRejections.size,
    });
  });
  registered = true;
}
