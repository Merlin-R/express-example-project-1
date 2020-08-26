import { Body, Delete, Get, Param, Post, Put, Query, Service } from "@propero/easy-api";
import { Filter } from "@propero/easy-filter";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { connection } from "src/connection";
import { Todo } from "src/entities";
import { parseMongoFilter, parseOptionalInt, splitComma } from "src/parser";
import { Page } from "src/util";
import { FindConditions } from "typeorm";

@Service("/todo")
export class TodoService {
  protected entity = Todo;
  protected repo = connection().getMongoRepository(Todo);

  @Get("/")
  public async getAll(
    @Query("filter", parseMongoFilter) where?: FindConditions<Todo>,
    @Query("select", splitComma) select?: (keyof Todo)[],
    @Query("top", parseOptionalInt) take: number = 50,
    @Query("skip", parseOptionalInt) skip: number = 0,
    @Query("expand", splitComma) relations?: string[]
  ): Promise<Page<Todo>> {
    const [data, total] = await this.repo.findAndCount({ where, select, skip, take, relations });
    return new Page<Todo>(data, total, take, skip);
  }

  @Get("/:id")
  public async getOne(
    @Param("id") id: string,
    @Query("select", splitComma) select?: (keyof Todo)[],
    @Query("expand", splitComma) relations?: string[]
  ): Promise<Todo | void> {
    return this.repo.findOne(id, { select, relations });
  }

  @Post("/")
  public async createOne(@Body() body: Partial<Todo>): Promise<Todo> {
    const todo = plainToClass(Todo, body);
    await validateOrReject(todo);
    return await this.repo.save(todo);
  }

  @Put("/:id")
  public async updateOne(@Param("id") id: string, @Body() body: Partial<Todo>): Promise<Todo> {
    const todo = plainToClass(Todo, body);
    await validateOrReject(todo);
    await this.repo.updateOne({ id }, todo);
    return this.repo.findOneOrFail(id);
  }

  @Delete("/id")
  public async deleteOne(@Param("id") id: string): Promise<void> {
    await this.repo.deleteOne({ id });
  }
}
