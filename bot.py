from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes
)

from database import SessionLocal
from models import User, RegistrationToken

import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    # Get Telegram ID
    telegram_id = update.effective_chat.id

    print("Telegram ID:", telegram_id)

    # Check whether registration code was provided
    if not context.args:
        await update.message.reply_text(
            "Please provide your registration code.\n"
            "Example: /start ABC123"
        )
        return

    # Get registration code
    code = context.args[0]

    print("Registration code:", code)

    db = SessionLocal()

    try:

        # Find token
        token = db.query(RegistrationToken).filter(
            RegistrationToken.code == code,
            RegistrationToken.used == False
        ).first()

        if not token:
            await update.message.reply_text(
                "Invalid or already used registration code."
            )
            return

        # Find the user associated with the token
        user = db.query(User).filter(
            User.id == token.user_id
        ).first()

        if not user:
            await update.message.reply_text(
                "User not found."
            )
            return

        # Store Telegram ID
        user.telegram_id = telegram_id

        # Mark token as used
        token.used = True

        db.commit()

        await update.message.reply_text(
            "Telegram account linked successfully!"
        )

    finally:
        db.close()


app = Application.builder().token(BOT_TOKEN).build()

app.add_handler(
    CommandHandler("start", start)
)

print("Telegram bot is running...")

app.run_polling()