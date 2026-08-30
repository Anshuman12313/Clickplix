from sqlalchemy import Column,Integer,String,VARCHAR,ForeignKey,Boolean,DateTime,BigInteger
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Float
from sqlalchemy.orm import relationship

from database import Base

class User(Base):
    __tablename__="user"

    id=Column(Integer,primary_key=True)
    name=Column(String)
    email=Column(VARCHAR(100),unique=True)
    password_hash=Column(
        String,
        nullable=True
    )
    telegram_id=Column(BigInteger,unique=True,nullable=True)
    photos=relationship("FaceImage",back_populates="user")


class FaceImage(Base):
    __tablename__="faceimage"

    id=Column(Integer,primary_key=True)
    user_id=Column(
        Integer,
        ForeignKey("user.id")
    )
    image_path=Column(String)
    embedding=Column(ARRAY(Float))

    user=relationship("User",back_populates="photos")

class TelegramToken(Base):
    __tablename__="telegram_tokens"
    id=Column(Integer,primary_key=True,autoincrement=True)
    code=Column(String,unique=True,autoincrement=True)
    user_id=Column(
        Integer,
        ForeignKey("user.id"),
        nullable=False,
        unique=True
    )
    #actually it checks if user.id availiable or not if available then onely allowed
    #else didnot allow as suppose you insert user_id=4 then in table User someone with id
    # 4 should must be exist
   # expires_at=Column(DateTime,nullable=False)
    used=Column(Boolean,default=False)
    user=relationship("User")

class Group(Base):
    __tablename__="groups"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,nullable=True)
    owner_id=Column(Integer,ForeignKey("user.id"),nullable=False)
    owner=relationship("User")
    members=relationship(
        "GroupMember",
        back_populates="group",
        cascade="all,delete-orphan"
    )

class GroupMember(Base):
    __tablename__="group_member"
    id=Column(Integer,primary_key=True,index=True)
    group_id=Column(
        Integer,
        ForeignKey("groups.id"),
        nullable=False
    )
    # user_id=Column(
    #     Integer,
    #     ForeignKey("user.id"),
    #     nullable=False
    # )
    user_id=Column(
        Integer,
        ForeignKey("user.id"),
        nullable=False
    )
    group=relationship(
        "Group",
        back_populates="members"
    )
    #due to user=relationship("User")the grou
    user=relationship("User")



