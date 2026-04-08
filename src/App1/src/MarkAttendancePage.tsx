import Calendar from "./Calendar";
import { dateFormatter } from '../../Common/formatter';
import allStudents from '../data/AllStudents';
import allAttendance from "../data/attendance";
import IAttendanceDay from "Types/IAttendanceDay";
import './MarkAttendancePage.css';

interface MarkAttendancePageProps {

}

const MarkAttendancePage: React.FC<MarkAttendancePageProps> = (props: MarkAttendancePageProps) => {

  const retrieveDatesAttendance = (date: string) => {
    const result = allAttendance.find((attendanceDay: IAttendanceDay) => attendanceDay.date === date);
    if (result) {
      return result.studentsPresent
    }
    return []
  }

  const {date, setDate} = (props as any).useState('date', dateFormatter.format(new Date(Date.UTC(2026,3,2))));
  const {studentList, setStudentList}: {studentList: () => string[], setStudentList: (data: any) => void} = (props as any).useState('studentList', retrieveDatesAttendance(date()));

  (props as any).log(date());
  (props as any).log(studentList());

  const setDateEffect = (data: any): void => {
    setDate(data);
    setStudentList(retrieveDatesAttendance(data));
  }
  
  const handleChange = (student: string) => {
    const index: number = studentList().indexOf(student);

    const newStudentList: string[] = studentList();
    if (index >= 0) {
      newStudentList.splice(index, 1);
      setStudentList(newStudentList)
    } 
    else {
      newStudentList.push(student);
      setStudentList(newStudentList)
    }
  }

  return (
    <div className="App flexColumn gap1 spaceBetweenJustify centerAlign padding05 borderBox" id="MarkAtt">
      <Calendar selectedDate={date()} setSelectedDate={setDateEffect}/>
      <div className="App_AttendanceDiv flexCol gap1 padding1 borderBox borderThin borderRadius">
        <p>
          Attendance for {date()}
        </p>
        <p>
          Total Attendance: {studentList().length}
        </p>
        <hr className="App_Attendance_Divider divider"/>
        <div className="App_Attendance_MarkersDiv overflowAuto">

        </div>
        {allStudents.map((student: string, index: number) => {
          return (
            <div key={index} className="App_MarkAttendanceDiv flexRow fullWidth spaceBetweenJustify centerAlign gap1">
              <p>
                {student}
              </p>
              <button className={"App_MarkAttendance_Input padding1 borderBox borderRadius margin05" + (studentList().includes(student) ? " App_MarkAttendance_Input-filled" : "")} onClick={() => handleChange(student)} />
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default MarkAttendancePage;