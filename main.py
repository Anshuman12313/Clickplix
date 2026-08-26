from sqlalchemy.orm import Session
from database import engine,get_db,Base
from models import User,FaceImage
from fastapi import FastAPI,Depends,UploadFile,File,HTTPException
from backend import register_face
from backend import find_face
from backend import send_photo
import numpy as np
app=FastAPI()

Base.metadata.create_all(bind=engine)
#as we have created table the database will not automatically know it so this will tell database i hvae created this table if it not exist create it

@app.get("/")
def home():
    return {
        "message":"FastAPI is connected to PostgreSql"
    }

@app.post("/users")
def create_user(
    name:str,
    email:str,
    telegram_id:str|None=None,
    db:Session=Depends(get_db)
):
    user=User(
        name=name,
        email=email,
        telegram_id=telegram_id
    )

    db.add(user)
    db.commit()

@app.post("/faceimage")
async def add_face(
    user_id:int,
    file:UploadFile=File(...),
    db:Session=Depends(get_db)
):
    user=db.query(User).filter(User.id==user_id).first()
    if not user:
        raise HTTPException(
            status_cod=404,
            detail="User not found"
        )
    image_path=f"uploads/{file.filename}"
    with open(image_path,"wb") as buffer:
        buffer.write(await file.read())

    embedding=register_face(image_path)
    face=FaceImage(
        user_id=user_id,
        image_path=image_path,
        embedding=embedding.tolist()
    )

    db.add(face)
    db.commit()
    db.refresh(face)
    return{
        "message":"Face registered",
        "face_id":face.id,
        "embedding_dimension":len(embedding)
    }


#writing endpoint to check if uploded face is in our database

@app.post("/click")
async def click(
    file:UploadFile=File(...),
    db:Session=Depends(get_db)
):
    image_path=f"uploads/{file.filename}"
    with open(image_path,"wb") as buffer:
        buffer.write(await file.read())
    obj=find_face(db,image_path,0.5)
    print("Object:", obj)
    
    if obj["found"]:
        user=db.query(User).filter(User.id==obj["user_id"]).first()
        print("Telegram ID:", user.telegram_id)
        send_photo(
            user.telegram_id,
            image_path
        )
        
    return obj