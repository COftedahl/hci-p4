import Calendar from "./Calendar";
import { dateFormatter } from '../../Common/formatter';
import allAttendance from '../data/attendance';
import './all.css';
import IAttendanceDay from "Types/IAttendanceDay";

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

  const getAttendanceFromDate = (date: string) => {
    return allAttendance.find((dayAttendance: IAttendanceDay) => dayAttendance.date === date)
  }

  const {date, setDate} = (props as any).useState('date', dateFormatter.format(new Date(Date.UTC(2026,3,2))));
  const {attendance, setAttendance}: {attendance: () => IAttendanceDay, setAttendance: (data: any) => void} = (props as any).useState('attendance', getAttendanceFromDate(date()));

  const setDateEffect = (data: any): void => {
    setDate(data);
    const result = getAttendanceFromDate(data) 
    setAttendance(result);
  }

  return (
    <div className="App flexColumn gap1 spaceBetweenJustify centerAlign padding05 borderBox">
      <Calendar selectedDate={date()} setSelectedDate={setDateEffect}/>
      <div className="App_AttendanceDiv flexCol gap1 padding1 borderBox borderThin borderRadius">
        <p>
          Attendance for {date()}
        </p>
        <hr className="App_Attendance_Divider divider"/>
        <div className="App_Attendance_DataDiv gap1 flexRow spaceBetweenJustify centerAlign">
          <p>
            Total Attendance: 
          </p>
          <p>
            {attendance().totalAttendance}
          </p>
        </div>
        <div className="App_Attendance_DataDiv gap1 flexRow spaceBetweenJustify centerAlign">
          <p>
            Students: 
          </p>
          <p>
            {attendance().studentsPresent}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;