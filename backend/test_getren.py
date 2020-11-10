import os
import tempfile
import pytest
import subprocess

from app.models import User

os.environ["FLASK_APP"] = "testconfig.py"
subprocess.call("flask db upgrade",shell = True)

from testconfig import app

def test_create_user():
    email = "whinderson"
    password = "luizavoltapramim"
    user = User.register(email,password)

    assert user is not None

def test_repeated_user():
    email = "whinderson"
    password = "luizavoltapramim"
    user = User.register(email,password)
    
    assert user is None
