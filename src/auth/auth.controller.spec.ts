import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { User } from "src/entities/user.entity"
import { LoginDto } from "./dto/login-auth.dto"
import { BadRequestException, UnauthorizedException } from "@nestjs/common"

const newUser: User = new User({
  id: 1,
  email: "fido@gmail.com",
  name: "fidoo",
  surname: "dido",
  password: "1234",
})

const token = {
  token: "eydmaopsd-edasda-dasdsad",
}

describe("AuthController", () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn().mockResolvedValue(newUser),
            login: jest.fn().mockResolvedValue(token),
          },
        },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it("should be defined", () => {
    expect(authController).toBeDefined()
  })

  describe("create", () => {
    it("should create a new user and return it", async () => {
      const body: CreateUserDto = {
        email: "fido@gmail.com",
        name: "fidoo",
        surname: "dido",
        password: "1234",
      }
      const result = await authController.signup(body)

      expect(result).toEqual(newUser)
      expect(authService.signup).toHaveBeenCalledTimes(1)
      expect(authService.signup).toHaveBeenCalledWith(body)
    })

    it("should throw an exception if email already exists", () => {
      const body: CreateUserDto = {
        email: "fido@gmail.com",
        name: "fidoo",
        surname: "dido",
        password: "1234",
      }

      jest
        .spyOn(authService, "signup")
        .mockRejectedValueOnce(new BadRequestException())

      expect(authController.signup(body)).rejects.toThrow(BadRequestException)
    })
  })

  describe("login", () => {
    it("should return a token jwt", async () => {
      const body: LoginDto = {
        email: "fido@gmail.com",
        password: "1234",
      }
      const result = await authController.login(body)

      expect(result).toEqual(token)
      expect(authService.login).toHaveBeenCalledTimes(1)
      expect(authService.login).toHaveBeenCalledWith(body)
    })

    it("should throw an exception if email or password wrong", () => {
      const body: LoginDto = {
        email: "fido@gmail.com",
        password: "1234",
      }

      jest
        .spyOn(authService, "login")
        .mockRejectedValueOnce(new UnauthorizedException())

      expect(authController.login(body)).rejects.toThrow(UnauthorizedException)
    })
  })
})
