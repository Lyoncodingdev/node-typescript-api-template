import { UserDTO } from "../model/UserDTO";
import { UserRepository } from "../repository/UserRepository";


export class UserService {
    userRepo: UserRepository;

    constructor(userRepo: UserRepository){
        this.userRepo = userRepo;
    }

    async getUserByEmail(email: string): Promise<UserDTO> {
        var user = await this.userRepo.findByEmail(email);
        if (user){
            return UserDTO.fromUser(user);
        } else {
            return new UserDTO(-1, "", "");
        }
    }

    async createUser(user: UserDTO){
        var newUser = await this.userRepo.createUser(user.name, user.email);
        if (newUser){
            return UserDTO.fromUser(newUser);
        }
    };
};