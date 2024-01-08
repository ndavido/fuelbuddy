FROM python:3.8-slim

WORKDIR /app/backend

COPY . /app/backend

RUN pip install -r requirements.txt

EXPOSE 5000

ENV NAME World

CMD ["python", "app.py"]

