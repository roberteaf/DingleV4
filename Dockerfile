FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN playwright install chromium

COPY . .

EXPOSE 8080

CMD ["python", "app.py"]
