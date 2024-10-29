import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AuthGuard } from './auth/auth.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true });
  app.use(cookieParser());
  app.useGlobalGuards(app.get(AuthGuard));

  // For more info about the code below, visit:
  // https://dev.to/nithinkjoy/how-to-use-class-validator-and-return-custom-error-object-in-nestjs-562h
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  // This creates a SwaggerUI API documentation
  // To view it, run the app and visit http://localhost:3000/api (change port if necessary)
  const config = new DocumentBuilder()
    .setTitle('SwaggerUI Documentation')
    .setDescription('Description goes here')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
