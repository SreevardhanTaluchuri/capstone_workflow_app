export interface User{
    id? : string,
    name : string,
    email : string,
    role : string,
    team : string,
}

export interface SignUp{
    name : string,
    email : string,
    password : string,   
}

export interface Login{
    email : string,
    password : string,
}