import Gender from "../../models/gender";
import User from "../../models/user";

export default abstract class ICreateUserRepository {
    abstract call(params: CreateUserParams): Promise<User>;
}

export interface CreateUserParams {
    username: string,
    name: string,
    email: string,
    number: string,
    birthdate: Date,
    gender: Gender
}