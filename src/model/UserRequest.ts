import { User } from "../../generated/prisma";

export class UserRequest {
    id: number;
    email: string;
    name?: string;
    constructor(id: number, email: string, name?: string) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    public static fromUser(user: User): UserRequest {
        return new UserRequest(user.id, user.email, user.name);
    }

    public static emptyUser(){
        return new UserRequest(-1, "", "");
    }
};