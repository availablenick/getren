import os
import pickle
from io import BytesIO
from google_auth_oauthlib.flow import Flow, InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseUpload
from google.auth.transport.requests import Request
from google.auth.credentials import Credentials

from flask import request, g
from app import app

CLIENT_SECRET_FILE = '../../client_secrets.json'
API_NAME = 'youtube'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

@app.route('/youtube_oauth_callback', methods=['GET'])
def callback():
    code = request.args.get('code')
    path_file = 'getren.ini'
    if not os.path.exists(path_file):
        file = open(path_file, 'w')
        file.write(f'code={code}')
        file.close()
    return code, 200

# @app.route('/youtube_upload', methods=['GET'])
def upload_video(video, attributes_form):
    service = create_service()
    request_body = {
        'snippet': {
            'categoryId': 19,
            'title': attributes_form['title'],
            'description': attributes_form['description'],
        },
        'status': {
            'privacyStatus': 'public',
            'selfDeclaredMadeForKids': False, 
        },
        'notifySubscribers': False
    }
    mediaFile = MediaIoBaseUpload(BytesIO(video.read()), mimetype=video.mimetype)

    if not service:
        return

    try:
        response_upload = service.videos().insert(
            part='snippet,status',
            body=request_body,
            media_body=mediaFile
        ).execute()
        return (True, response_upload)
    except Exception as e:
        return (False, e)

def create_service():
    cred = None
    pickle_file = f'token_{API_NAME}_{API_VERSION}.pickle'
    if os.path.exists(pickle_file):
        with open(pickle_file, 'rb') as f:
            cred = pickle.load(f)

    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                    'client_secrets.json',
                    scopes=SCOPES,
                    redirect_uri='http://localhost:5000/youtube_oauth_callback')                    
            auth_url, _ = flow.authorization_url(prompt='consent')
            print('Please go to this URL: {}'.format(auth_url))
            code = input('Enter the authorization code: ')
            flow.fetch_token(code=code)
            cred = flow.credentials

        with open(pickle_file, 'wb') as f:
            pickle.dump(cred, f)

    try:
        service = build(API_NAME, API_VERSION, credentials=cred)
        print(API_NAME, 'service created successfully')
        return service
    except Exception as e:
        print('Unable to connect.')
        print(e)
        return None
