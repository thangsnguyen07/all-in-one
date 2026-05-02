import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'user_account' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string

<<<<<<<< Updated upstream:src/modules/user/modules/user/infrastructure/entities/user.entity.ts
  @Column({ name: 'username' })
  username: string
========
  @Column({ name: 'username', unique: true })
  username!: string
>>>>>>>> Stashed changes:src/modules/user/infrastructure/entities/user.entity.ts

  @Column({ name: 'email', unique: true, nullable: true })
  email!: string

  @Column({ name: 'password' })
  password!: string

  @Column({ name: 'is_verified', default: false })
  isVerified!: boolean

  @Column({ name: 'is_active', default: true })
  isActive!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null
}
