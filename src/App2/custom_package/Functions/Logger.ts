const log = (...data: any) => {
  let caller: string = "unknown";
  console.log("Data: ", ...data);
  console.log("This: ", this);
  try {
    throw new Error();
  } catch (e: any) {
    caller = e.stack;
    console.log(caller);
  }
};

if (typeof globalThis.log !== "function") {
  globalThis.log = log.bind(log);
}

export default log;
