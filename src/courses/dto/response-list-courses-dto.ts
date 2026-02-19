import { ICourse } from "../interfaces/ICourse";

export class ResponseListCourseDto {
  content: ICourse[];
  page: number;
  size: number;
  totalElements: number;
}
