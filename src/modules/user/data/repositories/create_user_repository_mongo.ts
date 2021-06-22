import ICreateUserRepository, { CreateUserParams } from "../../domain/usecases/create_user/create_user_repository_interface";
import mongoose from 'mongoose';

export default class CreateUserRepositoryMongo implements ICreateUserRepository {
    call(params: CreateUserParams): Promise<void> {
        throw new Error("Method not implemented.");
    }
}