import { ApiProperty } from '@nestjs/swagger';

export class PaginatedListDto<T> {
  @ApiProperty({
    type: 'object',
    isArray: true,
    description: 'Array of items of generic type T.',
    additionalProperties: true,
  })
  data: T[];

  @ApiProperty({
    description:
      'Metadata about the response, including total number of items and additional context.',
    example: {
      total: 100,
      lastUpdated: '2024-06-29T12:00:00.000Z',
      isCached: false,
      extra: {},
    },
  })
  meta: {
    total: number;
    lastUpdated?: string;
    isCached?: boolean;
    cachedAt?: string;
    expiresAt?: string;
    extra?: any;
  };
}
