from fastapi import FASTAPI,HTTPException,Depends
from pydantic import BaseModel
from typing import List,Annotated


app=FASTAPI()

class ChoiceBase(BaseModel):
    choice_text:str
    is_correct:bool

class QuestionBase(BaseModel):
    question_text:str
    choices:List[ChoiceBase]