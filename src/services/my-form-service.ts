import { Body, Header, Post, Service } from "@propero/easy-api";
import { plainToClass } from "class-transformer";
import { IsEmail, Length, validateOrReject } from "class-validator";
import multer from "multer";

class MyForm {
  @Length(0, 30)
  public firstName?: string;
  @Length(0, 30)
  public lastName?: string;
  @IsEmail()
  public email?: string;
  @Length(0, 500)
  public content?: string;
}

const upload = multer({ storage: multer.memoryStorage() });

@Service("/my-form")
export class MyFormService {
  @Post("/", {
    status: 201,
    before: [upload.none()],
    responseType: "none"
  })
  public async onFormPost(@Body() data: MyForm, @Header("content-type") contentType: string): Promise<void> {
    if (!contentType.startsWith("multipart/form-data")) return;
    console.log(contentType);
    data = plainToClass(MyForm, data);
    await validateOrReject(data);
    console.log(data);
  }
}
