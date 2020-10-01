FROM python:3.8-buster
RUN pip install -U Flask
RUN pip install sqlite3
RUN pip install -U python-dotenv
RUN mkdir /app
WORKDIR /app
CMD ["bash"]
