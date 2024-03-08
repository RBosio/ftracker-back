import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Bruce",
    required: false,
  })
  name: string
  @ApiProperty({
    name: "surname",
    type: "string",
    example: "Wayne",
    required: false,
  })
  surname: string
  @ApiProperty({
    name: "password",
    type: "string",
    example: "$uperp4ssw0rd",
    required: false,
  })
  password: string
}
