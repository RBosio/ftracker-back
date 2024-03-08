import { ApiProperty } from "@nestjs/swagger"

export class CreateSpentDto {
  @ApiProperty({
    name: "mount",
    type: "number",
    example: 20.4,
    required: true,
  })
  mount: number
  @ApiProperty({
    name: "description",
    type: "string",
    example: "a simple spent",
    required: true,
  })
  description: string
  @ApiProperty({
    name: "userId",
    type: "number",
    example: 1,
    required: true,
  })
  userId: number
}
