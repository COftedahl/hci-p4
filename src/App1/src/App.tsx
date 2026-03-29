import Calendar from "./Calendar";
import { dateFormatter } from '../../Common/formatter';
import './all.css';

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

  const {date, setDate} = (props as any).useState('date', dateFormatter.format(new Date()));

  return (
    <div className="App flexColumn spaceBetweenJustify centerAlign padding05 borderBox">
      <Calendar selectedDate={date()} setSelectedDate={setDate}/>
      <div className="App_AttendanceDiv flexCol gap1 padding1 borderBox borderThin borderRadius">
        <p>
          Attendance for {date()}
        </p>
        <hr className="App_Attendance_Divider divider"/>
        
      </div>
    </div>
  );
}

export default App;