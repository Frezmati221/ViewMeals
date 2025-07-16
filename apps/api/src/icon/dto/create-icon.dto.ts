import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateIconDto {
  @ApiProperty({
    example:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>',
    description: "SVG code for the icon - must be a valid SVG element",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^<svg[\s\S]*<\/svg>$/i, {
    message: "svg must be a valid SVG element",
  })
  svg: string;

  @ApiProperty({
    example: "Restaurant Icon",
    description: "Human-readable label for the icon",
  })
  @IsNotEmpty()
  @IsString()
  label: string;
}
