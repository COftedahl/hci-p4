import { datetimeFormatter } from '../src/formatter';

const logs: {timestamp: string, interactionTarget: string}[] = [];
const originalLog = console.log;

export const updateConsoleLog = () => {
  // Override console.log
  console.log = function(...args) {
    args.map((data: any) => {
      let savingObj: {timestamp: string, interactionTarget: string} | null = null;
      const timestamp: string = datetimeFormatter.format(Date.now());
      try {
        if (typeof data === 'string') {
          savingObj = {timestamp: timestamp, interactionTarget: data};
        }
        else {
          const val: string = JSON.stringify(data);
          savingObj = {timestamp: timestamp, interactionTarget: val};
        }
      }
      catch (e) {
        savingObj = {timestamp: timestamp, interactionTarget: String(data)};
      }
      logs.push(savingObj);
    }); // Store as string
    originalLog(...args); // Still print to console
  };
}

export const saveLogs = async () => {
  console.log = originalLog;
  const result = await fetch("https://hci-p4-be.vercel.app/db/save", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify({logs: logs}), 
  });
  console.log(result);
  console.log("Result of saving logs: ", await result.text());

  updateConsoleLog();
}

export const logLogs = () => {
  console.log(logs);
}