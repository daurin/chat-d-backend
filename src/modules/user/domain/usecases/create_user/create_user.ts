import { exception } from "console";
import { ValidationException, ValidationGroupException, ValidationParam } from "../../../../shared/domain/exception/validation_exception";
import CreateUserRepositoryMongo from "../../../data/repositories/create_user_repository_mongo";
import User from "../../models/user";
import IUserValidation from "../../validations/user_validations_interface";
import UserValidationRepository from "../../validations/user_validation_repository";
import ICreateUserRepository, { CreateUserParams } from "./create_user_repository_interface";

export default class CreateUser extends ICreateUserRepository {
    repository: ICreateUserRepository;
    repositoryValidation: IUserValidation;
    constructor() {
        super();
        this.repository = new CreateUserRepositoryMongo();
        this.repositoryValidation = new UserValidationRepository();
    }

    async call(params: CreateUserParams): Promise<User> {
        let exceptions: Array<ValidationParam> = [];

        await this.repositoryValidation
            .validateEmail(params.email)
            .catch((err: ValidationException) => exceptions.push(err.param));

        await this.repositoryValidation
            .validateName(params.name)
            .catch((err: ValidationException) => exceptions.push(err.param));

        await this.repositoryValidation
            .validateUsername(params.username)
            .catch((err: ValidationException) => exceptions.push(err.param));

        await this.repositoryValidation
            .validateBirthdate(params.birthdate)
            .catch((err: ValidationException) => exceptions.push(err.param));

        await this.repositoryValidation
            .validateGender(params.gender)
            .catch((err: ValidationException) => exceptions.push(err.param));

        await this.repositoryValidation
            .validateNumber(params.number)
            .catch((err: ValidationException) => exceptions.push(err.param));

        if (exceptions.length > 0) throw new ValidationGroupException(exceptions);


        return this.repository.call(params);
    }
}