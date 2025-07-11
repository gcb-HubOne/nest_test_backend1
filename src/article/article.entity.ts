import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Content } from './content.entity';
import { Label } from './label.entity';

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToOne(() => Content, { cascade: true, eager: true, nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    content?: Content;

    @ManyToOne(() => Label, label => label.articles, { eager: true, nullable: true })
    label?: Label;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}