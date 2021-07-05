import { Request, Response } from "express";
import { ValidationGroupException } from "../../../shared/domain/exception/validation_exception";
import Gender from "../../domain/models/gender";
import CreateUser from "../../domain/usecases/create_user/create_user";

const postUser = async (req: Request, res: Response) => {
    try {
        await (new CreateUser()).call({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            birthdate: new Date(req.body.birthdate),
            gender: req.body.gender as Gender,
        })
            .then(user => {
                res.status(201).send(user.toJson());
            })
            .catch((err) => {
                if (err instanceof ValidationGroupException) {
                    res.status(400).send({
                        errors: err.params.map((e) => {
                            return {
                                name: e.name,
                                message: e.message,
                                type: e.type,
                            };
                        })
                    });
                }
                else throw err;
            });


    } catch (err) {
        console.log(err);
        res.status(500);
        res.send(err);
    }
};

export default postUser;