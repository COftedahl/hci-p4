import { ChangeEvent } from "react";

interface CalendarProps {
  selectedDate: string, 
  setSelectedDate: (date: Date) => void, 
}

const Calendar: React.FC<CalendarProps> = (props: CalendarProps) => {

  return (
    <div className="Calendar padding1 borderThin borderBox flexColumn centerJustify centerAlign borderRadius">
      <div className="Calendar_HeaderDiv flexRow spaceBetweenJustify centerAlign padding1 borderBox">
        Select Date
      </div>
      <hr className="Calendar_Divider divider"/>
      <input type="date" className="Calendar_Input" name="Calendar_Input" value={props.selectedDate} onChange={(e: ChangeEvent) => props.setSelectedDate((e.target as any).value)}/>
    </div>
  );
}

export default Calendar;