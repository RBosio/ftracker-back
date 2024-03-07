import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"

import { User } from "./user.entity"

@Entity()
export class Spent {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  mount: number

  @Column()
  description: string

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  date: Date

  @ManyToOne(() => User, (user) => user.spents)
  user: User
}
