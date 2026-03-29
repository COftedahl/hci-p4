import JSON_STUDENT_NAMES from './MOCK_STUDENT_NAMES';

const allStudents: string[] = (JSON_STUDENT_NAMES).map(({first_name, last_name}: {first_name: string, last_name: string}) => first_name + " " + last_name);

export default allStudents;