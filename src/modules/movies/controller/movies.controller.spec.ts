import { Test, TestingModule } from '@nestjs/testing';
import { TestUtil } from '../../../../test/util/TestUtil';
import { Movies } from '../entity/movies.entity';
import { MoviesService } from '../service/movies.service';
import { MoviesController } from './movies.controller';

describe('MoviesController', () => {
  let controller: MoviesController;
  let mockMovie: Movies;

  const mockMoviesService = {
    createMovie: jest.fn(),
    findAllMovies: jest.fn(),
    findMovieById: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    mockMovie = TestUtil.getMockMovie();
  });

  beforeEach(() => {
    mockMoviesService.createMovie.mockReset();
    mockMoviesService.findAllMovies.mockReset();
    mockMoviesService.findMovieById.mockReset();
    mockMoviesService.updateMovie.mockReset();
    mockMoviesService.deleteMovie.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when create movie', () => {
    it('should create a movie and return it', async () => {
      mockMoviesService.createMovie.mockReturnValue(mockMovie);

      const movie = {
        title: mockMovie.title,
        description: mockMovie.description,
        release: mockMovie.release,
      };

      const createdMovie = await controller.createMovie(movie);

      expect(createdMovie).toHaveProperty('id', 1);
      expect(createdMovie).toMatchObject(mockMovie);
      expect(mockMoviesService.createMovie).toBeCalledWith(movie);
      expect(mockMoviesService.createMovie).toBeCalledTimes(1);
    });
  });

  describe('when search all movies', () => {
    it('should search all movies and return them', async () => {
      mockMoviesService.findAllMovies.mockReturnValue([mockMovie]);

      const movies = await controller.findAllMovies();

      expect(movies).toHaveLength(1);
      expect(movies).toMatchObject([mockMovie]);
      expect(mockMoviesService.findAllMovies).toBeCalledTimes(1);
    });
  });

  describe('when search movie by id', () => {
    it('should find a existing movie and return it', async () => {
      mockMoviesService.findMovieById.mockReturnValue(mockMovie);

      const movie = await controller.findMovieById('1');

      expect(movie).toMatchObject(mockMovie);
      expect(mockMoviesService.findMovieById).toBeCalledWith('1');
      expect(mockMoviesService.findMovieById).toBeCalledTimes(1);
    });
  });

  describe('when update a movie', () => {
    it('should update a existing movie and return it', async () => {
      const movieTitleUpdate = {
        title: 'Update Movie Title',
      };

      mockMoviesService.updateMovie.mockReturnValue({
        ...mockMovie,
        ...movieTitleUpdate,
      });

      const updatedMovie = await controller.updateMovie(
        '1',
        movieTitleUpdate,
      );

      expect(updatedMovie).toMatchObject(movieTitleUpdate);
      expect(mockMoviesService.updateMovie).toBeCalledWith(
        '1',
        movieTitleUpdate,
      );
      expect(mockMoviesService.updateMovie).toBeCalledTimes(1);
    });
  });

  describe('when delete a movie', () => {
    it('should delete a existing movie', async () => {
      await controller.deleteMovie('1');

      expect(mockMoviesService.deleteMovie).toBeCalledWith('1');
      expect(mockMoviesService.deleteMovie).toBeCalledTimes(1);
    });
  });
});
