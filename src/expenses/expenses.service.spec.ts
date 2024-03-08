import { Test, TestingModule } from "@nestjs/testing"
import { ExpensesService } from "./expenses.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Expenses } from "src/entities/expenses.entity"
import { User } from "src/entities/user.entity"
import { Repository } from "typeorm"
import { CreateExpensesDto } from "./dto/create-expenses.dto"
import { UpdateExpensesDto } from "./dto/update-expenses.dto"
import { NotFoundException } from "@nestjs/common"
import { UserService } from "src/user/user.service"

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

describe("ExpensesService", () => {
  let expensesService: ExpensesService
  let userService: UserService
  let expensesRepository: Repository<Expenses>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(expensesList[0].user),
          },
        },
        {
          provide: getRepositoryToken(Expenses),
          useValue: {
            create: jest.fn().mockReturnValue(expensesList[0]),
            save: jest.fn().mockResolvedValue(expensesList[0]),
            find: jest.fn().mockResolvedValue(expensesList),
            findOne: jest.fn().mockResolvedValue(expensesList[0]),
            softDelete: jest.fn().mockResolvedValue(expensesList[0]),
          },
        },
      ],
    }).compile()

    expensesService = module.get<ExpensesService>(ExpensesService)
    userService = module.get<UserService>(UserService)
    expensesRepository = module.get<Repository<Expenses>>(getRepositoryToken(Expenses))
  })

  it("should be defined", () => {
    expect(expensesService).toBeDefined()
    expect(expensesRepository).toBeDefined()
  })

  describe("findAll", () => {
    it("should return an array expenses of users", async () => {
      const result = await expensesService.findAll(1)

      expect(result).toEqual(expensesList)
      expect(result).toHaveLength(1)
      expect(expensesRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe("findOne", () => {
    describe("findOneById", () => {
      it("should return an expenses", async () => {
        const result = await expensesService.findOne(1)

        expect(result).toEqual(expensesList[0])
        expect(expensesRepository.findOne).toHaveBeenCalledTimes(1)
        expect(expensesRepository.findOne).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        })
      })
    })

    it("should throw an exception if expenses not found", () => {
      jest
        .spyOn(expensesRepository, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(expensesService.findOne(4)).rejects.toThrow(NotFoundException)
    })
  })

  describe("create", () => {
    it("should create a new expenses and return it", async () => {
      const body: CreateExpensesDto = {
        mount: 20.34,
        description: "new expenses entity",
        userId: 1,
      }

      const response = await expensesService.create(body)

      expect(response).toEqual(expensesList[0])
      expect(expensesRepository.create).toHaveBeenCalledTimes(1)
      expect(expensesRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should throw an exception if user not found", () => {
      const body: CreateExpensesDto = {
        mount: 20.34,
        description: "new expenses entity",
        userId: 1,
      }

      jest
        .spyOn(userService, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(expensesService.create(body)).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should return expenses updated", async () => {
      const body: UpdateExpensesDto = {
        description: "a description updated",
      }

      const request = await expensesService.update(1, body)

      expect(request).toEqual(expensesList[0])
      expect(expensesRepository.findOne).toHaveBeenCalledTimes(1)
      expect(expensesRepository.save).toHaveBeenCalledTimes(1)
    })

    it("should throw an exception if expenses not found", () => {
      const body: UpdateExpensesDto = {
        description: "a description updated",
      }

      jest
        .spyOn(expensesService, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(expensesService.update(4, body)).rejects.toThrow(NotFoundException)
    })
  })

  describe("remove", () => {
    it("should return expenses removed", async () => {
      const request = await expensesService.remove(1)

      expect(request).toEqual(expensesList[0])
      expect(expensesRepository.findOne).toHaveBeenCalledTimes(1)
      expect(expensesRepository.softDelete).toHaveBeenCalledTimes(1)
      expect(expensesRepository.softDelete).toHaveBeenCalledWith(1)
    })

    it("should throw an exception if expenses not found", () => {
      jest
        .spyOn(expensesService, "findOne")
        .mockRejectedValueOnce(new NotFoundException())

      expect(expensesService.remove(4)).rejects.toThrow(NotFoundException)
    })
  })
})
