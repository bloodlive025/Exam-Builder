import { ICourse } from "./ICourse";

export interface IListCourse {
    courses: ICourse[];
    page: number;
    size: number;
    totalElements: number;
}