import { User } from "../../generated/prisma";

export class UserDTO {
    id: number;
    email: string;
    name?: string;
    constructor(id: number, email: string, name?: string) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    public static fromUser(user: User): UserDTO {
        return new UserDTO(user.id, user.email, user.name);
    }

    public static emptyUser(){
        return new UserDTO(-1, "", "");
    }
};