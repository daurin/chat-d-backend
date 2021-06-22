import { Request, Response } from "express";
import Joi from "joi";
import Gender from "../../domain/models/gender";
import CreateUser from "../../domain/usecases/create_user/create_user";

const postUser = async (req: Request, res: Response) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            // username: Joi.string().max(15).required(),
            name: Joi.string().max(30).required(),
            number: Joi.string().max(16).regex(/^\+\d+(-\d+)*$/).required(),
            birthdate: Joi.date().required(),
            gender: Joi.string().valid(...Object.values(Gender)).required(),
        });
        const resultValidate: Joi.ValidationResult = schema.validate(req.body, {
            abortEarly: false
        });
        if(resultValidate.error!=undefined){
            res.status(400).send({
                errors:resultValidate.error.details,
                message: resultValidate.error.message,
            });
            return;   
        }
        await (new CreateUser()).call(
            {
                username: req.body.username,
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                birthdate: req.body.birthdate,
                gender: req.body.gender,
            }
        ).catch(err=>{
            res.status(201).send(err.toString());
        }).then(value=>{
            res.send(`POST request to the user: ${req.body.email}`);
        });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send(err.toString());
    }
};

export default postUser;