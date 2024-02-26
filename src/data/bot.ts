import { BotType, BotsType } from 'type/Bot';

class DBBot {
  private readonly bots: BotsType;

  constructor() {
    this.bots = [];
  }

  createBot(bot: BotType) {
    this.bots.push(bot);
  }

  findBot(gameId: number): number | undefined {
    if (this.bots.length) {
      const bot = this.bots.find((bot) => bot.gameId === gameId);
      if (bot) {
        return bot.idBot;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}

export const dbBot = new DBBot();
