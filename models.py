from sqlalchemy import Column,Integer,String,VARCHAR,ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Float
from sqlalchemy.orm import relationship

from database import Base

class User(Base):
    __tablename__="user"

    id=Column(Integer,primary_key=True)
    name=Column(String)
    email=Column(VARCHAR(100),unique=True)

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