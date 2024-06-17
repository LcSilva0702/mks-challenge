import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../common/swagger/responses/ErrorResponse';
import { MovieResponse } from '../../../common/swagger/responses/MovieResponse';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { Movies } from '../entity/movies.entity';
import { MoviesService } from '../service/movies.service';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Search all movies' })
  @ApiOkResponse({ type: [MovieResponse], description: 'The found movies' })
  async findAllMovies(): Promise<Movies[]> {
    return await this.moviesService.findAllMovies();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiCreatedResponse({ type: MovieResponse, description: 'Created movie' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Bad Request' })
  async createMovie(@Body() data: CreateMovieDto): Promise<Movies> {
    return await this.moviesService.createMovie(data);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Search a movies by id' })
  @ApiOkResponse({ type: MovieResponse, description: 'The found movie' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Not Found' })
  async findMovieById(@Param('id') id: string): Promise<Movies> {
    return await this.moviesService.findMovieById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a movie' })
  @ApiOkResponse({ type: MovieResponse, description: 'Updated movie' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Not Found' })
  async updateMovie(
    @Param('id') id: string,
    @Body() data: UpdateMovieDto,
  ): Promise<Movies> {
    return this.moviesService.updateMovie(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiNoContentResponse({ description: 'Deleted movie' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Not Found' })
  async deleteMovie(@Param('id') id: string): Promise<void> {
    await this.moviesService.deleteMovie(id);
  }
}
