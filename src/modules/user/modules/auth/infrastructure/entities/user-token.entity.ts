import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'user_token' })
export class UserTokenEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string

  @Column({ name: 'user_id', unique: true })
  userId!: string

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken!: string

  @Column({ name: 'revoked_at', nullable: true })
  revokedAt!: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
