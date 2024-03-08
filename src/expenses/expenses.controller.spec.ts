import { Test, TestingModule } from "@nestjs/testing"
import { ExpensesController } from "./expenses.controller"
import { ExpensesService } from "./expenses.service"
import { Expenses } from "src/entities/expenses.entity"
import { User } from "src/entities/user.entity"
import { NotFoundException } from "@nestjs/common"
import { CreateExpensesDto } from "./dto/create-expenses.dto"
import { UpdateExpensesDto } from "./dto/update-expenses.dto"

const expensesList = [
  new Expenses({
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

const newExpenses = new Expenses({
  id: 2,
  mount: 20.34,
  description: "new expenses entity",
  user: new User({
    id: 1,
    email: "example@gmail.com",
    name: "example",
    surname: "example",
  }),
})

const updateExpenses = new Expenses({
  id: 2,
  mount: 46.42,
  description: "update expenses entity",
  user: new User({
    id: 1,
    email: "example@gmail.com",
    name: "example",
    surname: "example",
  }),
})

describe("ExpensesController", () => {
  let expensesController: ExpensesController
  let expensesService: ExpensesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: {
            create: jest.fn().mockResolvedValue(newExpenses),
            findAll: jest.fn().mockResolvedValue(expensesList),
            findOne: jest.fn().mockResolvedValue(expensesList[0]),
            update: jest.fn().mockResolvedValue(updateExpenses),
            remove: jest.fn().mockResolvedValue(expensesList[0]),
          },
        },
      ],
    }).compile()

    expensesController = module.get<ExpensesController>(ExpensesController)
    expensesService = module.get<ExpensesService>(ExpensesService)
  })

  it("should be defined", () => {
    expect(expensesController).toBeDefined()
    expect(expensesService).toBeDefined()
  })

  describe("getAll", () => {
    it("should return a expenses list of user", async () => {
      const result = await expensesController.findAll("1")

      expect(result).toEqual(expensesList)
      expect(expensesService.findAll).toHaveBeenCalledTimes(1)
    })

    it("should return an empty array if not expenses entities", async () => {
      jest.spyOn(expensesService, "findAll").mockResolvedValueOnce([])
      const result = await expensesController.findAll("2")

      expect(result).toEqual([])
      expect(expensesService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOne", () => {
    it("should return a expenses entity", async () => {
      const result = await expensesController.findOne("1")

      expect(result).toEqual(expensesList[0])
      expect(expensesService.findOne).toHaveBeenCalledTimes(1)
      expect(expensesService.findOne).toHaveBeenCalledWith(1)
    })

    it("should throw a not found exception if expenses not exist", async () => {
      jest
        .spyOn(expensesService, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(expensesController.findOne("2")).rejects.toThrow(NotFoundException)
    })
  })

  describe("create", () => {
    it("should return a expenses entity created", async () => {
      const body: CreateExpensesDto = {
        mount: 20.34,
        description: "new expenses entity",
        userId: 1,
      }

      const result = await expensesController.create(body)

      expect(result).toEqual(newExpenses)
      expect(expensesService.create).toHaveBeenCalledTimes(1)
      expect(expensesService.create).toHaveBeenCalledWith(body)
    })

    it("should throw a not found exception if user not exist", async () => {
      const body: CreateExpensesDto = {
        mount: 20.34,
        description: "new expenses entity",
        userId: 4,
      }

      jest
        .spyOn(expensesService, "create")
        .mockRejectedValueOnce(new NotFoundException())

      expect(expensesController.create(body)).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should return a expenses entity updated", async () => {
      const body: UpdateExpensesDto = {
        mount: 46.42,
        description: "update expenses entity",
      }

      const result = await expensesController.update("2", body)

      expect(result).toEqual(updateExpenses)
      expect(expensesService.update).toHaveBeenCalledTimes(1)
      expect(expensesService.update).toHaveBeenCalledWith(2, body)
    })

    it("should throw a not found exception if expenses not exist", async () => {
      const body: UpdateExpensesDto = {
        mount: 46.42,
        description: "update expenses entity",
      }

      jest
        .spyOn(expensesService, "update")
        .mockRejectedValueOnce(new NotFoundException())

      expect(expensesController.update("40", body)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe("remove", () => {
    it("should return a expenses entity removed", async () => {
      const result = await expensesController.remove("1")

      expect(result).toEqual(expensesList[0])
      expect(expensesService.remove).toHaveBeenCalledTimes(1)
      expect(expensesService.remove).toHaveBeenCalledWith(1)
    })

    it("should throw a not found exception if expenses not exist", async () => {
      jest
        .spyOn(expensesService, "remove")
        .mockRejectedValueOnce(new NotFoundException())

      expect(expensesController.remove("2")).rejects.toThrow(NotFoundException)
    })
  })
})
