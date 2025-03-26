import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 200})
    name: string;

    @Column()
    cpf: string;

    @Column()
    email: string;

    @Column({nullable: true})
    password_hash: string;
}