import os
import pickle

from io import BytesIO
from google_auth_oauthlib.flow import Flow, InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseUpload, HttpError
from google.auth.transport.requests import Request
from google.auth.credentials import Credentials

from flask import Blueprint, request, g

CLIENT_SECRET_FILE = '../../client_secrets.json'
API_NAME = 'youtube'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

bp = Blueprint('youtube', __name__)

@bp.route('/youtube_oauth_callback', methods=['GET'])
def callback():
    code = request.args.get('code')
    path_file = 'getren.ini'
    if not os.path.exists(path_file):
        file = open(path_file, 'w')
        file.write(f'code={code}')
        file.close()
    return code, 200

# @bp.route('/youtube_upload', methods=['GET'])
def upload_video(video, attributes_form):
    service = create_service()
    request_body = {
        'snippet': {
            'title': attributes_form['title'],
            'description': attributes_form['description'],
        },
        'status': {
            'privacyStatus': 'unlisted',
            'selfDeclaredMadeForKids': False, 
        },
        'notifySubscribers': False
    }
    mediaFile = MediaIoBaseUpload(BytesIO(video.read()), mimetype=video.mimetype, chunksize=-1, resumable=True)

    if not service:
        return
    response_upload = service.videos().insert(
        part='snippet,status',
        body=request_body,
        media_body=mediaFile
    )

    response = resumable_upload(response_upload)

    return response

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
        #print(API_NAME, 'service created successfully')
        return service
    except Exception as e:
        return None

def resumable_upload(insert_request):
  response = None
  error = None
  retry = 0
  while response is None:
    try:
      #print("Uploading file...")
      status, response = insert_request.next_chunk()
      if response is not None:
        if 'id' in response:
          #print(f"Video id {response['id']} was successfully uploaded.")
          return True, response
        else:
          pass
          #print(f"The upload failed with an unexpected response: {response}")
    except HttpError as e:
      error = f"A retriable HTTP error {e.resp.status} occurred:\n{e.content}"
    except Exception as e:
      error = f"A retriable error occurred: {e}"

    if error is not None:
      #print (error)
      retry += 1
      if retry > 3:
        return False, error

      max_sleep = 2 ** retry
      sleep_seconds = random.random() * max_sleep
      #print (f"Sleeping {sleep_seconds} seconds and then retrying...")
      time.sleep(sleep_seconds)