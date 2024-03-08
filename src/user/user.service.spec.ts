import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "src/entities/user.entity"
import { Repository } from "typeorm"
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

const userList: User[] = [
  new User({
    email: "example@gmail.com",
    name: "example",
    surname: "example",
    password: "123",
  }),
  new User({
    email: "fiido@gmail.com",
    name: "fiido",
    surname: "fiido",
    password: "123",
  }),
  new User({
    email: "jhon@gmail.com",
    name: "jhon",
    surname: "doe",
    password: "123",
  }),
]

describe("UserService", () => {
  let userService: UserService
  let userRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(userList[0]),
            find: jest.fn().mockResolvedValue(userList),
            save: jest.fn().mockResolvedValue(userList[0]),
            findOne: jest.fn().mockResolvedValue(userList[0]),
          },
        },
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  it("should be defined", () => {
    expect(userService).toBeDefined()
  })

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const result = await userService.findAll()

      expect(result).toEqual(userList)
      expect(result).toHaveLength(3)
      expect(userRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe("findOne", () => {
    describe("findOneById", () => {
      it("should return an user", async () => {
        const result = await userService.findOne(1)

        expect(result).toEqual(userList[0])
        expect(userRepository.findOne).toHaveBeenCalledTimes(1)
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        })
      })
    })

    describe("findeOneByEmail", () => {
      it("should return an user", async () => {
        const result = await userService.findOneByEmail("example@gmail.com")

        expect(result).toEqual(userList[0])
        expect(userRepository.findOne).toHaveBeenCalledTimes(1)
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: "example@gmail.com",
          },
        })
      })
    })

    it("should throw an exception if user not found", () => {
      jest
        .spyOn(userRepository, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(userService.findOne(4)).rejects.toThrow(NotFoundException)
    })
  })

  describe("create", () => {
    it("should create a new user and return it", async () => {
      const body: CreateUserDto = {
        email: "example@gmail.com",
        name: "example",
        surname: "example",
        password: "123456",
      }

      jest.spyOn(userService, "findOneByEmail").mockReturnValueOnce(null)
      const response = await userService.create(body)

      expect(response).toEqual(userList[0])
      expect(userRepository.create).toHaveBeenCalledTimes(1)
      expect(userRepository.save).toHaveBeenCalledTimes(1)
      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1)
    })

    it("should throw an exception if email already exists", () => {
      const body: CreateUserDto = {
        email: "example@gmail.com",
        name: "example",
        surname: "example",
        password: "123456",
      }

      jest
        .spyOn(userRepository, "save")
        .mockRejectedValueOnce(new BadRequestException())

      expect(userService.create(body)).rejects.toThrow(BadRequestException)
    })
  })

  describe("update", () => {
    it("should return user updated", async () => {
      const body: UpdateUserDto = {
        password: "123",
      }

      const request = await userService.update(1, body)

      expect(request).toEqual(userList[0])
      expect(userRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should throw an exception if user not found", () => {
      const body: UpdateUserDto = {
        password: "123",
      }

      jest
        .spyOn(userRepository, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(userService.update(1, body)).rejects.toThrow(NotFoundException)
    })
  })
})
