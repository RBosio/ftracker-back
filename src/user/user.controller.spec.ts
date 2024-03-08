import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { User } from "src/entities/user.entity"
import { CreateUserDto } from "./dto/create-user.dto"
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
  let controller: UserController
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(newUser),
            findAll: jest.fn().mockResolvedValue(userEntityList),
            findOne: jest.fn().mockResolvedValue(userEntityList[0]),
            update: jest.fn().mockResolvedValue(updateUser),
          },
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  it("should be defined", () => {
    expect(UserController).toBeDefined()
    expect(UserService).toBeDefined()
  })

  describe("getAll", () => {
    it("should return a user list", async () => {
      const result = await controller.findAll()

      expect(result).toEqual(userEntityList)
      expect(service.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOne", () => {
    it("should return a user", async () => {
      const result = await controller.findOne("1")

      expect(result).toEqual(userEntityList[0])
      expect(result.id).toEqual(userEntityList[0].id)
      expect(service.findOne).toHaveBeenCalledTimes(1)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })

    it("should throw an exception", () => {
      jest.spyOn(service, "findOne").mockRejectedValueOnce(new Error())

      expect(controller.findOne("2")).rejects.toThrow()
    })
  })

  describe("create", () => {
    it("should create a new user and return it", async () => {
      const body: CreateUserDto = {
        email: "fido@gmail.com",
        name: "fidoo",
        surname: "dido",
        password: "1234",
      }
      const result = await controller.create(body)

      expect(result).toEqual(newUser)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(service.create).toHaveBeenCalledWith(body)
    })

    it("should throw an exception", () => {
      const body: CreateUserDto = {
        email: "fido@gmail.com",
        name: "fidoo",
        surname: "dido",
        password: "1234",
      }

      jest.spyOn(service, "create").mockRejectedValueOnce(new Error())

      expect(controller.create(body)).rejects.toThrow()
    })
  })

  describe("update", () => {
    it("should return an update user", async () => {
      const body: UpdateUserDto = {
        password: "newpassword",
      }

      const response = await controller.update("1", body)

      expect(response).toEqual(updateUser)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith(1, body)
    })

    it("should throw an exception", () => {
      const body: UpdateUserDto = {
        password: "newpassword",
      }

      jest.spyOn(service, "update").mockRejectedValueOnce(new Error())

      expect(controller.update("2", body)).rejects.toThrow()
    })
  })
})
