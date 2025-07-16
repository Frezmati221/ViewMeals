import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { MongoError } from "mongodb";
import { Error as MongooseError } from "mongoose";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errors: any = null;

    // Handle HTTP exceptions (validation errors from class-validator)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === "object") {
        message =
          exceptionResponse.message || exceptionResponse.error || "Bad request";
        errors = exceptionResponse.message || null;
      } else {
        message = exceptionResponse;
      }
    }
    // Handle Mongoose validation errors
    else if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = "Validation failed";

      const validationErrors: any = {};
      for (const field in exception.errors) {
        const error = exception.errors[field];
        if (error instanceof MongooseError.ValidatorError) {
          validationErrors[field] = error.message;
        } else if (error instanceof MongooseError.CastError) {
          validationErrors[field] = `Invalid ${error.kind} for field ${field}`;
        } else if (error && typeof error === "object" && "message" in error) {
          validationErrors[field] = (error as any).message;
        } else {
          validationErrors[field] = "Validation error";
        }
      }

      errors = validationErrors;
    }
    // Handle MongoDB duplicate key errors
    else if (
      exception instanceof MongoError &&
      (exception as any).code === 11000
    ) {
      status = HttpStatus.CONFLICT;
      message = "Duplicate entry";
      const keyPattern = (exception as any).keyPattern;
      const duplicateField = Object.keys(keyPattern)[0];
      errors = {
        [duplicateField]: `${duplicateField} already exists`,
      };
    }
    // Handle Mongoose CastError (invalid ObjectId)
    else if (exception instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = "Invalid ID format";
      errors = {
        [exception.path]: `Invalid ${exception.kind} format for ${exception.path}`,
      };
    }
    // Handle other known errors
    else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);

      // Check if it's a known validation error pattern
      if (exception.message.includes("validation failed")) {
        status = HttpStatus.BAD_REQUEST;
        message = "Validation failed";

        // Try to extract field information from the error message
        const matches = exception.message.match(/(\w+): (.+?)(?=,|$)/g);
        if (matches) {
          const fieldErrors: any = {};
          matches.forEach((match) => {
            const [field, error] = match.split(": ");
            fieldErrors[field] = error;
          });
          errors = fieldErrors;
        }
      }
    } else {
      this.logger.error("Unknown exception type", exception);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errors && { errors }),
    };

    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      JSON.stringify(errorResponse)
    );

    response.status(status).json(errorResponse);
  }
}
