import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Pagination } from '../types/Pagination';

export const Page = createParamDecorator(
  (data: Pagination, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const limit = parseInt(query.limit) || data.limit || 20;
    const page = parseInt(query.page) || data.page || 1;
    return { limit, page } as Pagination;
  },
);
