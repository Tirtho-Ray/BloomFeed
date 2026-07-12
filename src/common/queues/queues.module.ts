import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueNames } from './queues.constants';
import { AuthQueueProducer } from './producers/auth-queue.producer';
import { EmailQueueProducer } from './producers/email-queue.producer';
import { AuthQueueProcessor } from './processors/auth-queue.processor';
import { EmailQueueProcessor } from './processors/email-queue.processor';
import { MailModule } from '../mail/mail.module';
import { PostQueueProcessor } from './processors/post-queue.processor';
import { PostQueueProducer } from './producers/post-queue.producer';
import { RedisModule } from '../redis/redis.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      { name: QueueNames.AUTH },
      { name: QueueNames.EMAIL },
      { name: QueueNames.POST },
    ),
    MailModule,
    RedisModule
  ],
  providers: [
    AuthQueueProducer,
    EmailQueueProducer,
    PostQueueProducer,
    AuthQueueProcessor,
    EmailQueueProcessor,
    PostQueueProcessor,
  ],
  exports: [
    AuthQueueProducer,
    EmailQueueProducer,
    PostQueueProducer,
  ],
})
export class QueuesModule { }
