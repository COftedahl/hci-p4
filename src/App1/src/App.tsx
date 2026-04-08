import './all.css';
import MarkAttendancePage from './MarkAttendancePage';
import ViewAttendancePage from './ViewAttendancePage';

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

  const {tab, setTab} = (props as any).useState("tab", 0);
  (props as any).log("Tab: ", tab());

  return (
    <div className="AppDiv flexColumn fullWidth fullHeight centerAlign topJustify" id="App">
      <div className="TabGroup flexRow gap1">
        <button className="Tab_ViewAttendanceButton button" onClick={() => setTab(0)}>
          View Attendance
        </button>
        <button className="Tab_MarkAttendanceButton button" onClick={() => setTab(1)}>
          Mark Attendance
        </button>
      </div>
      <div className="App_ContentDiv">
        {tab() === 0 ? 
        <div class="fullWidth fullHeight">
          <div class="fullWidth fullHeight"><ViewAttendancePage/></div>
          <div class="fullWidth fullHeight hidden"><MarkAttendancePage/></div>
        </div>
        : 
          ""
        }
        {tab() === 1 ?
        <div class="fullWidth fullHeight">
          <div class="fullWidth fullHeight hidden"><ViewAttendancePage/></div>
          <div class="fullWidth fullHeight"><MarkAttendancePage/></div>
        </div>
        :
          ""
        }
      </div>
    </div>
  );
}

export default App;