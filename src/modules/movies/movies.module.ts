import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './controller/movies.controller';
import { Movies } from './entity/movies.entity';
import { MoviesService } from './service/movies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movies])],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
