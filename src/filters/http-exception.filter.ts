import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error = 'Internal Server Error';

    // 处理HTTP异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || 'Error';
      } else {
        message = exceptionResponse as string;
      }
    }
    // 处理TypeORM异常
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      
      // 唯一约束错误
      if ((exception as any).code === 'ER_DUP_ENTRY') {
        message = '数据已存在，请勿重复添加';
        error = 'Duplicate Entry';
      } 
      // 外键约束错误
      else if ((exception as any).code === 'ER_ROW_IS_REFERENCED_2') {
        message = '该记录被其他数据引用，无法操作';
        error = 'Foreign Key Constraint';
      }
      else {
        message = '数据库操作失败';
        error = exception.message;
      }
    }

    // 记录错误日志
    console.error('Exception:', exception);

    // 响应客户端
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    });
  }
} 