import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm"

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

  constructor(spent?: Partial<Spent>) {
    this.id = spent?.id
    this.mount = spent?.mount
    this.description = spent?.description
    this.user = spent?.user
  }

  @DeleteDateColumn()
  deleted_at: Date
}
