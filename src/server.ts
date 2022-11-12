/**
 * Required External Modules
 */
import "reflect-metadata";
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { Container } from "typedi";
import * as dotenv from "dotenv";
import express, { request } from "express";
import helmet from "helmet";
import { createExpressServer, useContainer, getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from 'routing-controllers-openapi'
import { ItemsController } from "./controllers/items.controller";
import path from "path";
import * as swaggerUi from 'swagger-ui-express'
import { Logger } from "./common/logger/logger";
import { OpenAPIObject } from "openapi3-ts";

const { defaultMetadataStorage } = require('class-transformer/storage')

useContainer(Container);

dotenv.config();

Container.set(Logger, new Logger());

const routingControllersOptions = {
  cors: true,
  classTransformer: true,
  routePrefix: '/api',
  controllers: [ItemsController], // we specify controllers we want to use
};

// Parse class-validator classes into JSON Schema:
const schemas = validationMetadatasToSchemas({
  classTransformerMetadataStorage: defaultMetadataStorage,
  refPointerPrefix: '#/components/schemas/',
})

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    securitySchemes: {
      basicAuth: {
        scheme: 'basic',
        type: 'http',
      },
    },
  },
  info: {
    description: 'Generated with `routing-controllers-openapi`',
    title: 'My Node API Scaffold',
    version: '1.0.0',
  },
})

/**
 * App Variables
 */
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

// const app = express();

const app = createExpressServer(routingControllersOptions);

/**
 *  App Configuration
 */
// app.use(helmet());
app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(spec)
);

// Render spec on root:
app.get('/', (_req: any, res: { json: (arg0: OpenAPIObject) => void; }) => {
  res.json(spec)
})

/**
 * Server Activation
 */
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
