import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { User } from "src/entities/user.entity"
import { UpdateUserDto } from "./dto/update-user.dto"

const userEntityList: User[] = [
  new User({
    id: 1,
    email: "fido@gmail.com",
    password: "123",
    name: "jhon",
    surname: "doe",
  }),
]

const newUser: User = new User({
  id: 1,
  email: "fido@gmail.com",
  name: "fidoo",
  surname: "dido",
  password: "1234",
})

const updateUser: User = new User({
  id: 1,
  email: "fido@gmail.com",
  name: "fidoo",
  surname: "dido",
  password: "1234",
})

describe("UserController", () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(userEntityList),
            findOne: jest.fn().mockResolvedValue(userEntityList[0]),
            update: jest.fn().mockResolvedValue(updateUser),
          },
        },
      ],
    }).compile()

    userController = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  it("should be defined", () => {
    expect(UserController).toBeDefined()
    expect(UserService).toBeDefined()
  })

  describe("getAll", () => {
    it("should return a user list", async () => {
      const result = await userController.findAll()

      expect(result).toEqual(userEntityList)
      expect(userService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOne", () => {
    it("should return a user", async () => {
      const result = await userController.findOne("1")

      expect(result).toEqual(userEntityList[0])
      expect(result.id).toEqual(userEntityList[0].id)
      expect(userService.findOne).toHaveBeenCalledTimes(1)
      expect(userService.findOne).toHaveBeenCalledWith(1)
    })

    it("should throw an exception", () => {
      jest.spyOn(userService, "findOne").mockRejectedValueOnce(new Error())

      expect(userController.findOne("2")).rejects.toThrow()
    })
  })

  describe("update", () => {
    it("should return an update user", async () => {
      const body: UpdateUserDto = {
        password: "newpassword",
      }

      const response = await userController.update("1", body)

      expect(response).toEqual(updateUser)
      expect(userService.update).toHaveBeenCalledTimes(1)
      expect(userService.update).toHaveBeenCalledWith(1, body)
    })

    it("should throw an exception", () => {
      const body: UpdateUserDto = {
        password: "newpassword",
      }

      jest.spyOn(userService, "update").mockRejectedValueOnce(new Error())

      expect(userController.update("2", body)).rejects.toThrow()
    })
  })
})
