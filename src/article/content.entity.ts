import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'longtext' })
  text: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: 'json', nullable: true })
  table: any;

  @Column({ nullable: true })
  file: string;
} 