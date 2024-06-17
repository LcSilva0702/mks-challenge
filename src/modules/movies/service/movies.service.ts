import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { Movies } from '../entity/movies.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movies)
    private repository: Repository<Movies>,
  ) {}

  async findAllMovies(): Promise<Movies[]> {
    return await this.repository.find();
  }

  async createMovie(data: CreateMovieDto): Promise<Movies> {
    const movie = this.repository.create(data);
    return await this.repository.save(movie);
  }

  async findMovieById(id: string): Promise<Movies> {
    const movie = await this.repository.findOne(id);

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async updateMovie(id: string, data: UpdateMovieDto): Promise<Movies> {
    const movie = await this.findMovieById(id);
    await this.repository.update(id, { ...data });

    return this.repository.create({ ...movie, ...data });
  }

  async deleteMovie(id: string): Promise<void> {
    await this.findMovieById(id);
    await this.repository.delete(id);
  }
}
