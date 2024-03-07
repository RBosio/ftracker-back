import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

import { Spent } from "./spent.entity"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 20 })
  name: string

  @Column({ type: "varchar", length: 20 })
  surname: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @OneToMany(() => Spent, (spent) => spent.user)
  spents: Spent[]
}
