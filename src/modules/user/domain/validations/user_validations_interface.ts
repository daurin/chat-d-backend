export default interface IUserValidation{
    validateEmail(email:any):Promise<void>;
    existEmail(email:any):Promise<void>;
    validateName(name:any):Promise<void>;
    validateUsername(username:any):Promise<void>;
    validateNumber(number:any):Promise<void>;
    validateBirthdate(birthdate:any):Promise<void>;
    validateGender(gender:any):Promise<void>;
}