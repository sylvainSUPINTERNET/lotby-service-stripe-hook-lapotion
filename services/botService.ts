import axios from "axios";
import { IMessageFromTelegram, TELEGRAM_API } from "../functions"


export const applyCmd = async ( message:IMessageFromTelegram  ): Promise<void> =>  {


    let msg = message.message.text.split(" ");

    if ( msg[0] === "/start" ) {
        if ( msg.length > 1 ) {
            if ( msg[1] === process.env.BOT_PASSWORD ) {
                // TODO save user in database with chatId ( upsert )
                let response:string = encodeURIComponent(`[text URL](https://docs.pyrogram.org/)`);

                const telegramSendImageOptions = {
                    url: `${TELEGRAM_API}/sendMessage?chat_id=${message.message.chat.id}&text=${response}&parse_mode=MarkdownV2`,
                    method: "POST",
                }
                await axios(telegramSendImageOptions);
            }
        } 
    }


    return
    
}

export const applyCmdError = async ( errorMessageException: string ) => {

}