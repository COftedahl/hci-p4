import IAttendanceDay from '../Types/IAttendanceDay';
import allStudents from '../data/AllStudents';
import { dateFormatter } from '../../Common/formatter';

const generateAttendance = () => {
  const NUM_ATTENDANCE_DAYS: number = 30;
  const numStudents: number = allStudents.length;
  const allStudentNumbers: number[] = (new Array(numStudents).fill(0).map((_entry: number, index: number) => index));

  let data: IAttendanceDay[] = [];
  for (let i = 1; i <= NUM_ATTENDANCE_DAYS; i += 1) {
    const numStudentsPresent: number = Math.floor((Math.random() * (numStudents / 2)) + (numStudents / 2));
    
    //create shuffled array of students present
    const copyAllStudentNumbers: number[] = JSON.parse(JSON.stringify(allStudentNumbers));
    for (let j = 0; j < numStudentsPresent - 1; j += 1) {
      const k: number = Math.floor(Math.random() * (numStudentsPresent - j)) + j;
      const temp: number = copyAllStudentNumbers[j];
      copyAllStudentNumbers[j] = copyAllStudentNumbers[k]
      copyAllStudentNumbers[k] = temp;
    }

    const currDayAttendance: string[] = []
    for (let i = 0; i < numStudentsPresent; i += 1) {
      currDayAttendance.push(allStudents[copyAllStudentNumbers[i]]);
    }

    console.log(currDayAttendance);

    data.push({
      date: dateFormatter.format(new Date(Date.UTC(2026,3, i + 1))),
      totalAttendance: numStudentsPresent,
      studentsPresent: currDayAttendance, 
    })
  }

  console.log(data);
}

export default generateAttendance;