import Gender from "../../models/gender";

export default abstract class ICreateUserRepository {
    abstract call(params: CreateUserParams): Promise<void>;
}

export interface CreateUserParams {
    username: string,
    name: string,
    email: string,
    number: string,
    birthdate: Date,
    gender: Gender
}