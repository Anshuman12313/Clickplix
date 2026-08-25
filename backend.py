import cv2
from insightface.app import FaceAnalysis
import numpy as np
app=FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(ctx_id=-1)

def register_face(image_path):
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



