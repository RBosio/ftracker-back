import { ApiProperty } from "@nestjs/swagger"

export class UpdateSpentDto {
  @ApiProperty({
    name: "mount",
    type: "number",
    example: 12.8,
    required: false,
  })
  mount?: number
  @ApiProperty({
    name: "description",
    type: "string",
    example: "a simple spent updated",
    required: false,
  })
  description?: string
}
