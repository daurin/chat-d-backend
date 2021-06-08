interface Request {
    readonly type:string;
    readonly data:{[key: string]: any};
}