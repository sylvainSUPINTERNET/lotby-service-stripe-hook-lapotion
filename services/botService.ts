import axios from "axios";
import { Telegraf } from "telegraf";
import { IMessageFromTelegram, TELEGRAM_API } from "../functions"


export const applyCmd = async ( message:IMessageFromTelegram, telegramToken:string  ): Promise<void> =>  {
    let msg = message.message.text.split(" ");

    const bot = new Telegraf(telegramToken);

    if ( msg[0] === "/start" ) {
        if ( msg.length > 1 ) {
            if ( msg[1] === process.env.BOT_PASSWORD ) {
                bot.telegram.sendMessage(message.message.chat.id, '__TODO__  SIPEI', { parse_mode: 'MarkdownV2' });
            }
        } 
    }

    return
    
}

export const applyCmdError = async ( errorMessageException: string ) => {

}