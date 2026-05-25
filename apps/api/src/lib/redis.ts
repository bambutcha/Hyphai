import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const redis = new Redis(redisUrl, { maxRetriesPerRequest: 3 });
export const redisSub = new Redis(redisUrl, { maxRetriesPerRequest: 3 });

export const CONVERSATION_CHANNEL_PREFIX = 'hyphai:conversation:';

export async function publishConversationEvent(
  conversationId: string,
  event: unknown,
): Promise<void> {
  await redis.publish(
    `${CONVERSATION_CHANNEL_PREFIX}${conversationId}`,
    JSON.stringify(event),
  );
}
