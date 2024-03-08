import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

import { Expenses } from "./expenses.entity"

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

  @OneToMany(() => Expenses, (spent) => spent.user)
  spents: Expenses[]

  constructor(user?: Partial<User>) {
    this.id = user?.id
    this.name = user?.name
    this.surname = user?.surname
    this.email = user?.email
    this.password = user?.password
    this.spents = user?.spents
  }
}
