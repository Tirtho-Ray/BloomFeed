import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('redis.host', 'localhost'),
          port: configService.get('redis.port', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(

    ),
  ],
  providers: [
  ],
  exports: [

  ],
})
export class QueuesModule { }
