import cv2
from sqlalchemy.orm import Session
from insightface.app import FaceAnalysis
import numpy as np
from models import User,FaceImage
import os
from dotenv import load_dotenv
import requests
BOT_TOKEN=os.getenv("TELEGRAM_BOT_TOKEN")
app=FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(ctx_id=-1)

def register_face(image_path):
    print("Image path:", image_path)
    print("File exists:", os.path.exists(image_path))
    img=cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image")
    faces=app.get(img)
    if len(faces)==0:
        raise ValueError("No face detected")
    if len(faces)>1:
        raise ValueError("Multiple faces detected")
    face=faces[0]
    embeddings=face.embedding
    return embeddings


def cosine_similarity(a,b):
    return np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b))

def find_face(db:Session,image_path,threashold=0.5):
    new_embedding=register_face(image_path)
    new_embedding=np.asarray(new_embedding,dtype=np.float32)
    faces=db.query(FaceImage).all()
    best_similarity=-1
    best_user_id=None
    for face in faces:
        stored_embedding=np.asarray(
            face.embedding,
            dtype=np.float32
        )
        similarity=cosine_similarity(new_embedding,stored_embedding)
        if similarity>best_similarity:
            best_similarity=similarity
            best_user_id=face.user_id

    if(best_similarity>=threashold):
        return{
            "found":True,
            "user_id":best_user_id,
            "similarity":float(best_similarity)
        }

    return{
        "found":False,
        "user_id":None,
        "similarity":float(best_similarity)
    }

def send_photo(telegram_id,image_path,caption=None):
    url=f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"
    data={
        "chat_id":str(telegram_id)
    }
    if caption:
        data["caption"]=caption
    with open(image_path,"rb") as photo:
        files={
        "photo":photo
        }
        response=requests.post(
        url,
        data=data,
        files=files
        )
        print("Telegram status:", response.status_code)
        print("Telegram response:", response.text)
    return response.json()





    



