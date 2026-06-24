import { Mark } from './marks';
import { Course } from './course';

export interface Student {
  id?: number;
  name: string;
  email: string;
  marks: Mark[];
  // some backends return marks under `marksList`
  marksList?: Mark[];
  courses: Course[];
}