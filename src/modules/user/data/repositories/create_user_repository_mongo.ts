import { InsertOneWriteOpResult } from "mongodb";
import MongoDB from "../../../shared/services/mongo/mongodb";
import User from "../../domain/models/user";
import ICreateUserRepository, { CreateUserParams } from "../../domain/usecases/create_user/create_user_repository_interface";

export default class CreateUserRepositoryMongo implements ICreateUserRepository {

    
    async call(params: CreateUserParams): Promise<User> {

        let result: InsertOneWriteOpResult<any> | undefined = await new MongoDB().Db?.collection('users').insertOne({
            name: params.name,
            email: params.email,
            username: params.username || params.email,
            number: params.number,
            birthdate: params.birthdate.toISOString().slice(0, 10),
            gender: params.gender,
        });

        let added = result?.ops[0];

        return new User({
            id: added['_id'],
            name: added.name,
            email: added.email,
            username: added.username,
            number: added.number,
            birthdate: new Date(added.birthdate),
            gender: added.gender
        });
    }
}