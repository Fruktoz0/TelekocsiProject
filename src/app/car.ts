import { Person } from "./person";

export class Car {
    public id: String = '';
    public cityFrom: String = '';
    public cityTo: String = '';
    public km: Number = 0;
    public date: String = '';
    public owner: Person = new Person();
}
