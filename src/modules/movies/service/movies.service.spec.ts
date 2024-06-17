import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from '../../../../test/util/TestUtil';
import { Movies } from '../entity/movies.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let mockMovie: Movies;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movies), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    mockMovie = TestUtil.getMockMovie();
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when create movie', () => {
    it('should create a movie', async () => {
      mockRepository.create.mockReturnValueOnce(mockMovie);
      mockRepository.save.mockReturnValueOnce(mockMovie);

      const movie = {
        title: mockMovie.title,
        description: mockMovie.description,
        release: mockMovie.release,
      };

      const savedMovie = await service.createMovie(movie);

      expect(savedMovie).toHaveProperty('id', 1);
      expect(savedMovie).toMatchObject(mockMovie);
      expect(mockRepository.create).toBeCalledWith(movie);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('when search all movies', () => {
    it('should list all movies', async () => {
      mockRepository.find.mockReturnValue([mockMovie]);

      const movies = await service.findAllMovies();

      expect(movies).toHaveLength(1);
      expect(mockRepository.find).toBeCalledTimes(1);
    });
  });

  describe('when search movie by id', () => {
    it('should find a existing movie', async () => {
      mockRepository.findOne.mockReturnValue(mockMovie);

      const movie = await service.findMovieById('1');

      expect(movie).toMatchObject(mockMovie);
      expect(mockRepository.findOne).toBeCalledWith('1');
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });

    it('should return a exception when does not to find a movie', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await service.findMovieById('3').catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toMatchObject({ message: 'Movie not found' });
        expect(mockRepository.findOne).toBeCalledWith('3');
        expect(mockRepository.findOne).toBeCalledTimes(1);
      });
    });
  });

  describe('when update a movie', () => {
    it('should update a existing movie', async () => {
      const movieTitleUpdate = {
        title: 'Update Movie Title',
      };

      mockRepository.findOne.mockReturnValue(mockMovie);
      mockRepository.update.mockReturnValue({
        ...mockMovie,
        ...movieTitleUpdate,
      });
      mockRepository.create.mockReturnValue({
        ...mockMovie,
        ...movieTitleUpdate,
      });

      const updatedMovie = await service.updateMovie(
        '1',
        movieTitleUpdate,
      );

      expect(updatedMovie).toMatchObject(movieTitleUpdate);
      expect(mockRepository.findOne).toBeCalledWith('1');
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledWith('1', movieTitleUpdate);
      expect(mockRepository.update).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledWith({
        ...mockMovie,
        ...movieTitleUpdate,
      });
      expect(mockRepository.create).toBeCalledTimes(1);
    });
  });

  describe('when delete a movie', () => {
    it('should delete a existing movie', async () => {
      mockRepository.findOne.mockReturnValue(mockMovie);
      mockRepository.delete.mockReturnValue(mockMovie);

      await service.deleteMovie('1');

      expect(mockRepository.findOne).toBeCalledWith('1');
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledWith('1');
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
