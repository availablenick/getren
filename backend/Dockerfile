FROM python:3.8-buster
RUN pip install -U Flask python-dotenv flask-sqlalchemy flask-migrate flask-cors flask_mail \\
pytest PyJWT Flask-Testing psycopg2-binary google-api-python-client google-auth-httplib2 google-auth-oauthlib
RUN mkdir /app
WORKDIR /app
COPY . /app
CMD ["flask", "run"]
