import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 自定义禁止访问异常
 * 继承自 HttpException，允许我们定义特定的状态码和消息
 */
export class CustomForbiddenException extends HttpException {
  constructor(
    message = '禁止访问 - 自定义异常',
    status = HttpStatus.FORBIDDEN,
  ) {
    super(message, status);
  }
}
