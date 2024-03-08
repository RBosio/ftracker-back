import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
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
