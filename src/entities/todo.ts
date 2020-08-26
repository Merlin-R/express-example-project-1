import { Length } from "class-validator";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Todo {
  @ObjectIdColumn()
  public _id?: string;

  @Length(0, 120)
  @Column()
  public message?: string;

  @Column()
  public done: boolean = false;
}
