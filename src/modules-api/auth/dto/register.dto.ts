import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail(undefined, {message:"Wrong email!!!"})
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    fullName: string;
}
