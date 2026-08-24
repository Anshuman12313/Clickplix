#create_engine is used to create the connection between 
#sqlAlchemy and PostgreSQL                                  
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
URL_DATABASE='postgresql://postgres:2024@localhost:5432/clickplix'

engine=create_engine(URL_DATABASE)


SessionLocal=sessionmaker(autocommit=False,autoflash=False,bind=engine)

Base=declarative_base()
