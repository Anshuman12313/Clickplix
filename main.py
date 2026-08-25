from sqlalchemy.orm import Session
from database import engine,get_db,Base
from models import User,FaceImage
from fastapi import FastAPI,Depends,UploadFile,File,HTTPException
from backend import register_face
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
    db:Session=Depends(get_db)
):
    user=User(
        name=name,
        email=email
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


