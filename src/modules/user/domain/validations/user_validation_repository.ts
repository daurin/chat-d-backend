import Joi from "joi";
import { ValidationException } from "../../../shared/domain/exception/validation_exception";
import Gender from "../models/gender";
import IUserValidation from "./user_validations_interface";

export default class UserValidationRepository implements IUserValidation {

    async validateEmail(email: any): Promise<void> {
        let err = Joi.string().email().required().validate(email);
        if (err.error != undefined) throw new ValidationException({
            name: 'email',
            message:err.error.message, 
            type: err.error.details[0].type,
        });
    }

    async existEmail(email: string): Promise<void> {
        throw new Error("Not implementet");
    }

    async validateName(name: any): Promise<void> {
        let err = Joi.string().max(15).required().validate(name);
        if (err.error != undefined) throw new ValidationException({
            name: 'name',
            message:err.error.message,
            type: err.error.details[0].type,
        });
    }
    async validateUsername(username: any): Promise<void> {
        let err = Joi.string().max(30).validate(username);
        if (err.error != undefined) throw new ValidationException({
            name: 'username',
            message:err.error.message,
            type: err.error.details[0].type,
        });
    }
    async validateNumber(number: any): Promise<void> {
        let err = Joi.string().max(16).regex(/^\+\d+(-\d+)*$/).required().validate(number);
        if (err.error != undefined) throw new ValidationException({
            name: 'number',
            message:err.error.message,
            type: err.error.details[0].type,
        });
    }
    async validateBirthdate(birthdate: any): Promise<void> {
        let err = Joi.date().required().validate(birthdate);
        if (err.error != undefined) throw new ValidationException({
            name: 'birthdate',
            message:err.error.message,
            type: err.error.details[0].type,
        });
    }
    async validateGender(gender: any): Promise<void> {
        let err = Joi.string().valid(...Object.values(Gender)).required().validate(gender);
        if (err.error != undefined) throw new ValidationException({
            name: 'gender',
            message:err.error.message,
            type: err.error.details[0].type,
        });
    }
}