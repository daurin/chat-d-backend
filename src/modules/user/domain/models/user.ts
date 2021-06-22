import Gender from "./gender";

class User {
    readonly id: string;
    readonly username: string;
    readonly name: string;
    readonly email: string;
    readonly number: string;
    readonly birthdate: Date;
    readonly gender: Gender;

    constructor(params: {
        id: string,
        username: string,
        name: string,
        email: string,
        number: string,
        birthdate: Date,
        gender: Gender,
    }) {
        this.id = params.id;
        this.username = params.username;
        this.name = params.name;
        this.email = params.email;
        this.number = params.number;
        this.birthdate = params.birthdate;
        this.gender = params.gender;
    }
}

export default User;