import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { Movies } from '../../../src/modules/movies/entity/movies.entity';
import { MoviesService } from '../../../src/modules/movies/service/movies.service';
import { TestUtil } from '../../util/TestUtil';

describe('Movies (e2e)', () => {
  let app: INestApplication;
  let mockMovie: Movies;

  const mockMoviesService = {
    createMovie: jest.fn(),
    findAllMovies: jest.fn(),
    findMovieById: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MoviesService)
      .useValue(mockMoviesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    mockMovie = TestUtil.getMockMovie();
  });

  beforeEach(() => {
    mockMoviesService.createMovie.mockReset();
    mockMoviesService.findAllMovies.mockReset();
    mockMoviesService.findMovieById.mockReset();
    mockMoviesService.updateMovie.mockReset();
    mockMoviesService.deleteMovie.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/movies (POST)', () => {
    it('should create a movie and return it with http code 201', async () => {
      mockMoviesService.createMovie.mockReturnValue(mockMovie);

      const movie = {
        title: mockMovie.title,
        description: mockMovie.description,
        release: mockMovie.release,
      };

      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(movie);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toMatchObject({
        ...mockMovie,
        createdAt: mockMovie.createdAt.toISOString(),
      });
      expect(response.status).toBe(201);
      expect(mockMoviesService.createMovie).toBeCalledWith(movie);
      expect(mockMoviesService.createMovie).toBeCalledTimes(1);
    });
  });

  describe('/movies (GET)', () => {
    it('should search all movies and return them with http code 200', async () => {
      mockMoviesService.findAllMovies.mockReturnValue([mockMovie]);

      const response = await request(app.getHttpServer()).get('/movies');

      expect(response.body).toMatchObject([
        {
          ...mockMovie,
          createdAt: mockMovie.createdAt.toISOString(),
        },
      ]);
      expect(response.status).toBe(200);
      expect(mockMoviesService.findAllMovies).toBeCalledTimes(1);
    });
  });

  describe('/movies/:id (GET)', () => {
    it('should search a movie by id and return it with http code 200', async () => {
      mockMoviesService.findMovieById.mockReturnValue(mockMovie);

      const response = await request(app.getHttpServer()).get('/movies/1');

      expect(response.body).toMatchObject({
        ...mockMovie,
        createdAt: mockMovie.createdAt.toISOString(),
      });
      expect(response.status).toBe(200);
      expect(mockMoviesService.findMovieById).toBeCalledWith('1');
      expect(mockMoviesService.findMovieById).toBeCalledTimes(1);
    });
  });

  describe('/movies/:id (PUT)', () => {
    it('should update a existing movie and return it with http code 200', async () => {
      const movieTitleUpdate = {
        title: 'Update Movie Title',
      };

      mockMoviesService.updateMovie.mockReturnValue({
        ...mockMovie,
        ...movieTitleUpdate,
      });

      const response = await request(app.getHttpServer())
        .put('/movies/1')
        .send(movieTitleUpdate);

      expect(response.body).toMatchObject(movieTitleUpdate);
      expect(response.status).toBe(200);
      expect(mockMoviesService.updateMovie).toBeCalledWith(
        '1',
        movieTitleUpdate,
      );
      expect(mockMoviesService.updateMovie).toBeCalledTimes(1);
    });
  });

  describe('/movies/:id (DELETE)', () => {
    it('should delete a existing movie and return http code 204', async () => {
      const response = await request(app.getHttpServer()).delete('/movies/1');

      expect(response.status).toBe(204);
      expect(mockMoviesService.deleteMovie).toBeCalledWith('1');
      expect(mockMoviesService.deleteMovie).toBeCalledTimes(1);
    });
  });
});
