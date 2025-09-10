import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Trip } from './trip.entity';

export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  TOURIST = 'TOURIST',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.TOURIST })
  role: Role;

  @OneToMany(() => Trip, (trip) => trip.tourist, { cascade: true })
  trips: Trip[];
}
