import { Movies } from '../../src/modules/movies/entity/movies.entity';

export class TestUtil {
  static getMockMovie(): Movies {
    const movie = new Movies();
    movie.id = 1;
    movie.title = 'Movie Title';
    movie.description = 'Movie Description';
    movie.release = '20/06/2002';
    movie.createdAt = new Date();

    return movie;
  }
}
