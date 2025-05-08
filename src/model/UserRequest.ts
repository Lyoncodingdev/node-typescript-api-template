import { User } from "../../generated/prisma";

export class UserRequest {
    id: string;
    email: string;
    name?: string;
    constructor(id: string, email: string, name?: string) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    public toUser(): User {
        let userForm: User = {
            "id": this.id,
            "name": this.name,
            "email": this.email,
        };
        return userForm;
    }

    public static fromUser(user: User): UserRequest {
        return new UserRequest(user.id, user.email, user.name);
    }

    public static emptyUser(){
        return new UserRequest("", "", "");
    }
};