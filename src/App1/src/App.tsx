import Calendar from "./Calendar";
import { dateFormatter } from '../../Common/formatter';
import './all.css';

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

  const [date, setDate] = (props as any).useState(dateFormatter.format(new Date()));

  return (
    <div className="App flexColumn spaceBetweenJustify centerAlign padding05 borderBox">
      <Calendar selectedDate={date} setSelectedDate={setDate}/>
    </div>
  );
}

export default App;