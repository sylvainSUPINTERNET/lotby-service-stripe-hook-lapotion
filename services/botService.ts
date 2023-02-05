import axios from "axios";
import { Telegraf } from "telegraf";
import { IMessageFromTelegram, TELEGRAM_API } from "../functions"
import { MongoClient } from "mongodb";
import { DB_NAME, USERS_COLLECTION } from "../conf/constants";

export const applyCmd = async ( message:IMessageFromTelegram, telegramToken:string  ): Promise<void> =>  {
    let msg = message.message.text.split(" ");

    const bot = new Telegraf(telegramToken);

    if ( msg[0] === "/subscribe" ) {
        if ( msg.length > 1 ) {
            if ( msg[1] === process.env.BOT_PASSWORD ) {
                // mongodb+srv://user1234:user1234@cluster0.vhh4x.mongodb.net/?retryWrites=true&w=majority
                try {
                    const client = await MongoClient.connect(process.env.DB_CONN_STRING!);
                    const userCollection = client.db(DB_NAME).collection(USERS_COLLECTION);
                    const session = client.startSession();
                    session.startTransaction();
                    const query = { "chatId": message.message.chat.id }
                    const update = {
                        $set: {
                            "chatId": message.message.chat.id
                        }
                    };
                    const option = {
                        upsert: true,
                        session
                    };
                    await userCollection.updateOne(query, update, option);
                    await session.commitTransaction();
                    await session.endSession();
                    client.close();
                    bot.telegram.sendMessage(message.message.chat.id, 'Added with success', { parse_mode: 'MarkdownV2' });
                } catch ( e ) {
                    console.log(e);
                    bot.telegram.sendMessage(message.message.chat.id, `${e}`, { parse_mode: 'MarkdownV2' });
                }

            }
        } 
    }

    return
    
}

export const applyCmdError = async ( errorMessageException: string ) => {

}