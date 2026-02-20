import { ICourse } from "../interfaces/course";

export class ResponseListCourseDto {
  content: ICourse[];
  page: number;
  size: number;
  totalElements: number;
}
