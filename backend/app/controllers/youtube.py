import os
import requests
from google_auth_oauthlib.flow import Flow, InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
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
    payload = {
        'code': code,
        'client_id': os.environ.get('YOUTUBE_CLIENT_ID'),
        'client_secret': os.environ.get('YOUTUBE_CLIENT_SECRET'),
        'redirect_uri': 'http://localhost:5000/youtube_oauth_callback',
        'grant_type': 'authorization_code'
    }
    response_youtube = requests.post('https://accounts.google.com/o/oauth2/token', data=payload)
    if response_youtube.status_code == requests.codes.ok:
        response_youtube = response_youtube.json() 
        path_file = '../../getren.ini'
        if not os.path.exists(path_file):
            file = open(path_file, 'w')
            print(response_youtube)
            file.write(f'refresh_token={response_youtube["refresh_token"]}\n')
            file.close()
    return response_youtube, 200

def refresh_youtube_token():
    path_file = 'getren.ini'
    if os.path.exists(path_file):
        file = open(path_file)
        refresh_token = file.read()[14:-1]
        payload = {
            'client_id': os.environ.get('YOUTUBE_CLIENT_ID'),
            'client_secret': os.environ.get('YOUTUBE_CLIENT_SECRET'),
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token'
        }
        response_youtube = requests.post('https://accounts.google.com/o/oauth2/token', data=payload)
        if response_youtube.status_code == requests.codes.ok:
            response_youtube = response_youtube.json() 
            g.youtube_access_token = response_youtube['access_token']

# Credentials.refresh = refresh_youtube_token 

def create_youtube_service():
    refresh_youtube_token()
    credentials = Credentials(token=g.get(name='youtube_access_token'))
    try:
        youtube_service = build(API_NAME, API_VERSION, credentials=credentials)
        return youtube_service
    except Exception as e:
        print(e)
        return None

def upload_video_to_youtube():
    # youtube_service = create_youtube_service()
    refresh_youtube_token()
    mediaFile = MediaFileUpload('video.mp4')
    payload = {
        'part': 'snippet, status',
        'body': {
            'snippet': {
                'categoryI': 19,
                'title': 'Upload Testing',
                'description': 'Hello World Description',
                'tags': ['Travel', 'video test', 'Travel Tips']
            },
            'status': {
                'privacyStatus': 'private',
                'selfDeclaredMadeForKids': False 
            },
            'notifySubscribers': False
        },
        'mediaBody': mediaFile
    }
    access_token = g.get(name='youtube_access_token')
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.post('https://www.googleapis.com/youtube/v3/videos', data=payload, headers=headers)
    return response

@app.route('/youtube_service', methods=['GET'])
def service():
    # def refresh(self):
    #     refresh_youtube_token()
    #     return
    # setattr(Credentials, 'refresh', refresh)
    # print(getattr(Credentials, 'refresh'))
    try: 
        r = upload_video_to_youtube()
        print(r.content )
        return {}, 200
    except Exception as e:
        print(e)
        return {}, 500
