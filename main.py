from sqlalchemy.orm import Session
from database import engine,get_db,Base
from models import User,FaceImage,TelegramToken,Group,GroupMember
from fastapi import FastAPI,Depends,UploadFile,File,HTTPException
from backend import register_face
from backend import find_face
from backend import send_photo
from backend import generate_code
from datetime import datetime, timedelta
import numpy as np
import os
from fastapi import Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from auth import(
    verify_password,
    create_access_token,
    get_current_user,
    hash_password
)
os.makedirs("uploads",exist_ok=True)
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
#as we have created table the database will not automatically know it so this will tell database i hvae created this table if it not exist create it

@app.get("/")
def home():
    return {
        "message":"FastAPI is connected to PostgreSql"
    }

@app.post("/users")
async def create_user(
    name:str=Form(...),
    email:str=Form(...),
    password:str=Form(...),
    front_face:UploadFile=File(...),
    left_face:UploadFile=File(...),
    right_face:UploadFile=File(...),
    db:Session=Depends(get_db)
):
    try:
        existing_user=db.query(User).filter(
            User.email==email
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        user=User(
            name=name,
            email=email,
            password_hash=hash_password(password)
        )
        db.add(user)
        db.flush()

        images=[
            ("front",front_face),
            ("left",left_face),
            ("right",right_face)
        ]
        for position,file in images:
            image_path=f"uploads/{user.id}_{position}_{file.filename}"
            with open(image_path,"wb") as buffer:
                buffer.write(await file.read())

            embedding=register_face(image_path)
            face=FaceImage(
                user_id=user.id,
                image_path=image_path,
                embedding=embedding.tolist()
            )
            db.add(face)
        code=generate_code()
        token=TelegramToken(
            code=code,
            user_id=user.id,
           # expires_at=None
        )
        db.add(token)
        db.commit()
        return{
            "message":"User registered successfully",
            "user_id":user.id,
            "registration_code":code
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )




# @app.post("/faceimage")
# async def add_face(
#     user_id:int,
#     file:UploadFile=File(...),
#     db:Session=Depends(get_db)
# ):
#     user=db.query(User).filter(User.id==user_id).first()
#     if not user:
#         raise HTTPException(
#             status_cod=404,
#             detail="User not found"
#         )
#     image_path=f"uploads/{file.filename}"
#     with open(image_path,"wb") as buffer:
#         buffer.write(await file.read())

#     embedding=register_face(image_path)
#     face=FaceImage(
#         user_id=user_id,
#         image_path=image_path,
#         embedding=embedding.tolist()
#     )

#     db.add(face)
#     db.commit()
#     db.refresh(face)
#     return{
#         "message":"Face registered",
#         "face_id":face.id,
#         "embedding_dimension":len(embedding)
#     }


#writing endpoint to check if uploded face is in our database

@app.post("/groups/{group_id}/click")
async def click(
    group_id:int,
    file:UploadFile=File(...),
    db:Session=Depends(get_db)
):
        image_path=f"uploads/{file.filename}"
        with open(image_path,"wb") as buffer:
            buffer.write(await file.read())
        
        data=find_face(db,image_path,0.5,group_id)
        results=[]
        for obj in data:
            if obj["found"]:
                user=db.query(User).filter(User.id==obj["user_id"]).first()
                if user:
                    print("Matched user:",user.name)
                    print("Telegram ID:",user.telegram_id)
                    send_photo(
                        user.telegram_id,
                        image_path
                    )
                    results.append({
                        "found":True,
                        "user_id":user.id,
                        "name":user.name,
                        "similarity":obj["similarity"]
                    })
        return {
            "message":"Photo processed successfully",
            "group_id":group_id,
            "matches":results
        }

@app.post("/groups")
async def create_group(
    name:str=Form(...),
    current_user:User=Depends(get_current_user),
    db:Session=Depends(get_db)
):
    # user=db.query(User).filter(User.id==owner_id).first()
    # if not user:
    #     raise HTTPException(
    #         status_code=404,
    #         detail="user not found"
    #     )

    #creating the group

    group=Group(
        name=name,
        owner_id=current_user.id
    )
    db.add(group)
    db.flush()
    member=GroupMember(
        group_id=group.id,
        user_id=current_user.id
    )
    db.add(member)
    db.commit()
    db.refresh(group)
    return{
        "message":"Group Created successfully",
        "group_id":group.id,
        "group_name":group.name,
        "owner_id":group.owner_id
        }

@app.post("/groups/{group_id}/members")
async def add_member(
    group_id:int,
    registration_code:str=Form(...),
    db:Session=Depends(get_db)
):
    group=db.query(Group).filter(Group.id==group_id).first()
    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )
    token=db.query(TelegramToken).filter(
        TelegramToken.code==registration_code
    ).first()

    if not token:
        raise HTTPException(
            status_code=404,
            detail="Invalid registraion code"
        )
    user=db.query(User).filter(
        User.id==token.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    existing_member=db.query(GroupMember).filter(
        GroupMember.group_id==group_id,
        GroupMember.user_id==user.id
    ).first()

    if existing_member:
        raise HTTPException(
            source_code=400,
            detail="User is already a member of this group"
        )
    member=GroupMember(
        group_id=group_id,
        user_id=user.id
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return{
        "message":"Member added successfully",
        "group_id":group_id,
        "user_id":user.id,
        "name":user.name
    }

@app.get("/groups/{group_id}")
async def get_group(
    group_id: int,
    db: Session = Depends(get_db)
):
    # Find the group
    group = db.query(Group).filter(
        Group.id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    # Get all members of the group
    members = db.query(GroupMember).filter(
        GroupMember.group_id == group_id
    ).all()

    member_list = []

    for member in members:
        user = db.query(User).filter(
            User.id == member.user_id
        ).first()

        if user:
            member_list.append({
                "user_id": user.id,
                "name": user.name,
                "email": user.email
            })

    return {
        "group_id": group.id,
        "group_name": group.name,
        "owner_id": group.owner_id,
        "members": member_list
    }


@app.get("/groups")
async def get_user_groups(
    current_user:User=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user exists
    user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Find groups where the user is a member
    memberships = db.query(GroupMember).filter(
        GroupMember.user_id == current_user.id
    ).all()

    groups = []

    for membership in memberships:

        group = db.query(Group).filter(
            Group.id == membership.group_id
        ).first()

        if not group:
            continue

        # Count members
        member_count = db.query(GroupMember).filter(
            GroupMember.group_id == group.id
        ).count()

        groups.append({
            "group_id": group.id,
            "group_name": group.name,
            "owner_id": group.owner_id,
            "member_count": member_count
        })

    return {
        "user_id": current_user.id,
        "groups": groups
    }

@app.post("/login")
async def login(
    form_data:OAuth2PasswordRequestForm=Depends(),
    db:Session=Depends(get_db)
):
    user=db.query(User).filter(
        User.email==form_data.username
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    if user.password_hash is None:
        raise HTTPException(
        status_code=401, 
        detail="Incorrect email or password"
        )

    if not verify_password(
        form_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="This account does not have a password yet"
        )
    access_token=create_access_token(user.id)
    return{
        "access_token":access_token,
        "token_type":"bearer",
        "user":{
            "id":user.id,
            "name":user.name,
            "email":user.email
        }
    }

#details about the user 

@app.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    registration_token = db.query(TelegramToken).filter(
        TelegramToken.user_id == current_user.id
    ).order_by(
        TelegramToken.id.desc()
    ).first()

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,

        "telegram_connected": (
            current_user.telegram_id is not None
        ),

        "registration_code": (
            registration_token.code
            if registration_token
            else None
        )
    }




