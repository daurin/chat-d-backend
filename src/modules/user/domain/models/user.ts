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

    static fromJson(json: any): User {
        return new User({
            id: json['id'],
            name: json['name'],
            email: json['email'],
            username: json['username'],
            number: json['number'],
            birthdate: json['birthdate'],
            gender: json['gender'],
        });
    }

    toJson():any{
        return {
            id: this.id,
            username: this.username,
            name: this.name,
            email: this.email,
            number: this.number,
            birthdate: this.birthdate.toISOString().slice(0, 10),
            gender: this.gender,
        }
    }
}

export default User;