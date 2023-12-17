
from sqlalchemy import create_engine
from sqlalchemy.engine.base import Engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from sqlalchemy import update
import os
from ..model.save_chat_db import UserInteraction, Base


def save_chat_db(thread_id: str, last_prompt: str, thread_message: str) -> str:
    """Inserts or Update a thread into the database.

    Args:
        thread_id (str): The thread's ID.
        last_prompt (str): The last_prompt of user.
        thread_message: All User Interaction.
    """

    # Add a try catch block to catch any errors
    try:
        conn_str = os.getenv("DB_CONN_STR")

        if not conn_str:
            raise ValueError("Environment variable DB_CONN_STR is not set")

        engine: Engine = create_engine(conn_str, echo=True)

        Session = sessionmaker(bind=engine)

        db = Session()

        Base.metadata.create_all(bind=engine)

        thread_to_add = UserInteraction(
            thread_id=thread_id, last_prompt=last_prompt, thread_message=thread_message
        )

        is_thread_present = select(UserInteraction.thread_id).where(
            UserInteraction.thread_id == thread_id)

        print('is_thread_present', is_thread_present)
        print('is_thread_present', type(is_thread_present))

        check_is_thread_present = db.scalars(is_thread_present).all()
        print('check_is_thread_present', (check_is_thread_present))

        if (check_is_thread_present == []):
            db.add_all([thread_to_add])
            db.commit()
            return 'Thread added to database'

        print('Thread already present in database, updating thread', is_thread_present)
        print(thread_id, last_prompt)

        update_query = (
            update(UserInteraction)
            .where(UserInteraction.thread_id == thread_id)
            .values(thread_id=thread_id, last_prompt=last_prompt, thread_message=thread_message))

        res = db.execute(update_query)
        print('db.execute(update_query)', res)
        db.commit()

        return 'Thread updated in database'

    except Exception as e:
        # Print the error
        print(e)

        # Rollback the changes
        db.rollback()

        # Return None
        return f'Failed database action: {e}'
