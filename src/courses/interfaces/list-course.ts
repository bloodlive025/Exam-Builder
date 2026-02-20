import { ICourse } from "./course";

export interface IListCourse {
    courses: ICourse[];
    page: number;
    size: number;
    totalElements: number;
}