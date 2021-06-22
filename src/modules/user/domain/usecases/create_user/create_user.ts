import CreateUserRepositoryMongo from "../../../data/repositories/create_user_repository_mongo";
import ICreateUserRepository, { CreateUserParams } from "./create_user_repository_interface";

export default class CreateUser {
    repository:ICreateUserRepository;
    constructor(){
        this.repository=new CreateUserRepositoryMongo();
    }

    call(params:CreateUserParams):Promise<void>{
        return this.repository.call(params);
    }
}