import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Bruce",
    required: true,
  })
  name: string
  @ApiProperty({
    name: "surname",
    type: "string",
    example: "Wayne",
    required: true,
  })
  surname: string
  @ApiProperty({
    name: "email",
    type: "string",
    example: "bwayne@gmail.com",
    required: true,
  })
  email: string
  @ApiProperty({
    name: "password",
    type: "string",
    example: "$uperp4ssw0rd",
    required: true,
  })
  password: string
}
