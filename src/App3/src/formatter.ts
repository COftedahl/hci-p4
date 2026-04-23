export interface DateTimeFormatter extends Intl.DateTimeFormat {
  _internalformat: (date: Date) => string, 
}

const nativedatetimeFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour12: false, 
  year: "2-digit", 
  month: "2-digit", 
  day: "2-digit", 
  hour: "2-digit", 
  minute: "2-digit", 
  second: "2-digit", 
});

export const datetimeFormatter: DateTimeFormatter = {
  ...new Intl.DateTimeFormat("en-US", {
    hour12: false, 
    year: "2-digit", 
    month: "2-digit", 
    day: "2-digit", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
  }), 
  _internalformat: nativedatetimeFormatter.format, 
};

datetimeFormatter.format = (date: Date): string => {
  const [dateStr, time]: string[] = datetimeFormatter._internalformat(date).split(", ");
  const [mon, d, y]: string[] = dateStr.split("/");
  // const [h, min, s]: string[] = time.split(":");
  const delim: string = "-";
  return (mon + delim + d + delim + y + " " + time);
}

const nativedateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric", 
  month: "2-digit", 
  day: "2-digit", 
});

export const dateFormatter: DateTimeFormatter = {
  ...new Intl.DateTimeFormat("en-US", {
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit", 
  }), 
  _internalformat: nativedateFormatter.format, 
}

dateFormatter.format = (date: Date): string => {
  const [mon, d, y]: string[] = dateFormatter._internalformat(date).split("/");
  const delim: string = "-";
  return (y + delim + mon + delim + d);
}