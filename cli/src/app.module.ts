import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { CatModule } from './cat/cat.module';
import { UserService } from './user.service';

@Module({
  imports: [BookModule, CatModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
