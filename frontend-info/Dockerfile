FROM python:3.12-slim
WORKDIR /usr/src/app
COPY . .
EXPOSE 5052
CMD ["python", "-m", "http.server", "5052", "--bind", "0.0.0.0"]
