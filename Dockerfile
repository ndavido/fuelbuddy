FROM python:3.8-slim

WORKDIR /app/backend

COPY ./Backend /app/backend

RUN pip install -r requirements.txt

EXPOSE 5000

ENV NAME World

CMD ["python", "__init__.py"]

