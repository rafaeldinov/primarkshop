'use server';

import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { Telegraf } from 'telegraf';

// get chat_id from json use browser url https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
const bot = new Telegraf(process.env.BOT_TOKEN!!);

export async function sendMessageToBot(userMessage: string) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'ви не увійшли в систему' };
  }
  await bot.telegram.sendMessage(process.env.BOT_CHAT_ID!!, userMessage);
}
