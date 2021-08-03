import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  user_email: string;

  @Column()
  user_password: string;

  @Column()
  user_name: string;

  @Column({ default: '' })
  self_introduction: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  register_datetime: Date;

  @Column({ default: false })
  ban: boolean;

  @Column({ default: false })
  admin: boolean;
}
