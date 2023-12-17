from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

"""
table user_interaction
    - thread_id str pk
    - last_prompt str
    - thread_message
"""


class Base(DeclarativeBase):
    pass


class UserInteraction(Base):
    __tablename__ = 'user_interaction'

    thread_id: Mapped[str] = mapped_column(
        primary_key=True
    )
    last_prompt: Mapped[str] = mapped_column(
        nullable=False
    )
    thread_message: Mapped[str] = mapped_column(
        nullable=False,
    )
