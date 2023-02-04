import axios from "axios";
import { Telegraf } from "telegraf";
import { IMessageFromTelegram, TELEGRAM_API } from "../functions"


export const applyCmd = async ( message:IMessageFromTelegram, telegramToken:string  ): Promise<void> =>  {
    let msg = message.message.text.split(" ");

    const bot = new Telegraf(telegramToken);

    if ( msg[0] === "/start" ) {
        console.log("SHHH")

        if ( msg.length > 1 ) {
            console.log("SHHH")

            if ( msg[1] === process.env.BOT_PASSWORD ) {
                console.log("SHHH", message.message.chat.id)
                bot.telegram.sendMessage(message.message.chat.id, '**TODO**  SIPEI', { parse_mode: 'MarkdownV2' });
                // TODO save user in database with chatId ( upsert )
            }
        } 
    }


    return
    
}

export const applyCmdError = async ( errorMessageException: string ) => {

}