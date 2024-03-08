import { Test, TestingModule } from "@nestjs/testing"
import { SpentController } from "./spent.controller"
import { SpentService } from "./spent.service"
import { Spent } from "src/entities/spent.entity"
import { User } from "src/entities/user.entity"
import { NotFoundException } from "@nestjs/common"
import { CreateSpentDto } from "./dto/create-spent.dto"
import { UpdateSpentDto } from "./dto/update-spent.dto"

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

const newSpent = new Spent({
  id: 2,
  mount: 20.34,
  description: "new spent entity",
  user: new User({
    id: 1,
    email: "example@gmail.com",
    name: "example",
    surname: "example",
  }),
})

const updateSpent = new Spent({
  id: 2,
  mount: 46.42,
  description: "update spent entity",
  user: new User({
    id: 1,
    email: "example@gmail.com",
    name: "example",
    surname: "example",
  }),
})

describe("SpentController", () => {
  let spentController: SpentController
  let spentService: SpentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpentController],
      providers: [
        {
          provide: SpentService,
          useValue: {
            create: jest.fn().mockResolvedValue(newSpent),
            findAll: jest.fn().mockResolvedValue(spentList),
            findOne: jest.fn().mockResolvedValue(spentList[0]),
            update: jest.fn().mockResolvedValue(updateSpent),
            remove: jest.fn().mockResolvedValue(spentList[0]),
          },
        },
      ],
    }).compile()

    spentController = module.get<SpentController>(SpentController)
    spentService = module.get<SpentService>(SpentService)
  })

  it("should be defined", () => {
    expect(spentController).toBeDefined()
    expect(spentService).toBeDefined()
  })

  describe("getAll", () => {
    it("should return a spent list", async () => {
      const result = await spentController.findAll()

      expect(result).toEqual(spentList)
      expect(spentService.findAll).toHaveBeenCalledTimes(1)
    })

    it("should return an empty array if not spent entities", async () => {
      jest.spyOn(spentService, "findAll").mockResolvedValueOnce([])
      const result = await spentController.findAll()

      expect(result).toEqual([])
      expect(spentService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOne", () => {
    it("should return a spent entity", async () => {
      const result = await spentController.findOne("1")

      expect(result).toEqual(spentList[0])
      expect(spentService.findOne).toHaveBeenCalledTimes(1)
      expect(spentService.findOne).toHaveBeenCalledWith(1)
    })

    it("should throw a not found exception if spent not exist", async () => {
      jest
        .spyOn(spentService, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(spentController.findOne("2")).rejects.toThrow(NotFoundException)
    })
  })

  describe("create", () => {
    it("should return a spent entity created", async () => {
      const body: CreateSpentDto = {
        mount: 20.34,
        description: "new spent entity",
        userId: 1,
      }

      const result = await spentController.create(body)

      expect(result).toEqual(newSpent)
      expect(spentService.create).toHaveBeenCalledTimes(1)
      expect(spentService.create).toHaveBeenCalledWith(body)
    })

    it("should throw a not found exception if user not exist", async () => {
      const body: CreateSpentDto = {
        mount: 20.34,
        description: "new spent entity",
        userId: 4,
      }

      jest
        .spyOn(spentService, "create")
        .mockRejectedValueOnce(new NotFoundException())

      expect(spentController.create(body)).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should return a spent entity updated", async () => {
      const body: UpdateSpentDto = {
        mount: 46.42,
        description: "update spent entity",
      }

      const result = await spentController.update("2", body)

      expect(result).toEqual(updateSpent)
      expect(spentService.update).toHaveBeenCalledTimes(1)
      expect(spentService.update).toHaveBeenCalledWith(2, body)
    })

    it("should throw a not found exception if spent not exist", async () => {
      const body: UpdateSpentDto = {
        mount: 46.42,
        description: "update spent entity",
      }

      jest
        .spyOn(spentService, "update")
        .mockRejectedValueOnce(new NotFoundException())

      expect(spentController.update("40", body)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe("remove", () => {
    it("should return a spent entity removed", async () => {
      const result = await spentController.remove("1")

      expect(result).toEqual(spentList[0])
      expect(spentService.remove).toHaveBeenCalledTimes(1)
      expect(spentService.remove).toHaveBeenCalledWith(1)
    })

    it("should throw a not found exception if spent not exist", async () => {
      jest
        .spyOn(spentService, "remove")
        .mockRejectedValueOnce(new NotFoundException())

      expect(spentController.remove("2")).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
