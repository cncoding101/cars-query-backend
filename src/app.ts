import express from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';

class App {
  public express: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.intialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
    this.initialiseDatabaseConnection();
  }

  /**
   * helmet for security
   * cors for resource sharing across different domains
   * morgan for simplying of logging HTTP requests
   * allows for parsing of json
   * compression will reduce downloaded data served to user by compressing
   */
  private intialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });

    // quickfix for every other route
    this.express.use('/*', (req, res) => {
      res.send('Not found.');
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }

  private initialiseDatabaseConnection(): void {
    // setup the database connection to mongodb
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PORT, DATABASE, NODE_ENV } =
      process.env;

    mongoose.connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${
        NODE_ENV === 'development' ? 'mongodb' : 'localhost'
      }:${MONGO_PORT}/${DATABASE}?authSource=admin`
    );
  }
}

export default App;
