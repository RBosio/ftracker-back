import { Test, TestingModule } from "@nestjs/testing"
import { SpentService } from "./spent.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Spent } from "src/entities/spent.entity"
import { User } from "src/entities/user.entity"
import { Repository } from "typeorm"
import { CreateSpentDto } from "./dto/create-spent.dto"
import { UpdateSpentDto } from "./dto/update-spent.dto"
import { NotFoundException } from "@nestjs/common"
import { UserService } from "src/user/user.service"

const spentList = [
  new Spent({
    mount: 12.2,
    description: "a simple description",
    user: new User({
      id: 1,
      email: "example@gmail.com",
      name: "example",
      surname: "example",
    }),
  }),
]

describe("SpentService", () => {
  let spentService: SpentService
  let userService: UserService
  let spentRepository: Repository<Spent>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpentService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(spentList[0].user),
          },
        },
        {
          provide: getRepositoryToken(Spent),
          useValue: {
            create: jest.fn().mockReturnValue(spentList[0]),
            save: jest.fn().mockResolvedValue(spentList[0]),
            find: jest.fn().mockResolvedValue(spentList),
            findOne: jest.fn().mockResolvedValue(spentList[0]),
            softDelete: jest.fn().mockResolvedValue(spentList[0]),
          },
        },
      ],
    }).compile()

    spentService = module.get<SpentService>(SpentService)
    userService = module.get<UserService>(UserService)
    spentRepository = module.get<Repository<Spent>>(getRepositoryToken(Spent))
  })

  it("should be defined", () => {
    expect(spentService).toBeDefined()
    expect(spentRepository).toBeDefined()
  })

  describe("findAll", () => {
    it("should return an array spent of users", async () => {
      const result = await spentService.findAll(1)

      expect(result).toEqual(spentList)
      expect(result).toHaveLength(1)
      expect(spentRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe("findOne", () => {
    describe("findOneById", () => {
      it("should return an spent", async () => {
        const result = await spentService.findOne(1)

        expect(result).toEqual(spentList[0])
        expect(spentRepository.findOne).toHaveBeenCalledTimes(1)
        expect(spentRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        })
      })
    })

    it("should throw an exception if spent not found", () => {
      jest
        .spyOn(spentRepository, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(spentService.findOne(4)).rejects.toThrow(NotFoundException)
    })
  })

  describe("create", () => {
    it("should create a new spent and return it", async () => {
      const body: CreateSpentDto = {
        mount: 20.34,
        description: "new spent entity",
        userId: 1,
      }

      const response = await spentService.create(body)

      expect(response).toEqual(spentList[0])
      expect(spentRepository.create).toHaveBeenCalledTimes(1)
      expect(spentRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should throw an exception if user not found", () => {
      const body: CreateSpentDto = {
        mount: 20.34,
        description: "new spent entity",
        userId: 1,
      }

      jest
        .spyOn(userService, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(spentService.create(body)).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should return spent updated", async () => {
      const body: UpdateSpentDto = {
        description: "a description updated",
      }

      const request = await spentService.update(1, body)

      expect(request).toEqual(spentList[0])
      expect(spentRepository.findOne).toHaveBeenCalledTimes(1)
      expect(spentRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should throw an exception if spent not found", () => {
      const body: UpdateSpentDto = {
        description: "a description updated",
      }

      jest
        .spyOn(spentService, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(spentService.update(4, body)).rejects.toThrow(NotFoundException)
    })
  })

  describe("remove", () => {
    it("should return spent removed", async () => {
      const request = await spentService.remove(1)

      expect(request).toEqual(spentList[0])
      expect(spentRepository.findOne).toHaveBeenCalledTimes(1)
      expect(spentRepository.softDelete).toHaveBeenCalledTimes(1)
      expect(spentRepository.softDelete).toHaveBeenCalledWith(1)
    })

    it("should throw an exception if spent not found", () => {
      jest
        .spyOn(spentService, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(spentService.remove(4)).rejects.toThrow(NotFoundException)
    })
  })
})
