FROM python:3.9

WORKDIR /travel_ai

COPY ./requirements.txt /travel_ai/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /travel_ai/requirements.txt

COPY ./app /travel_ai/app

ENV OPENAI_API_KEY='Your OPENAI_API_KEY'
ENV TRAVEL_ASSISTANT_ID='Your TRAVEL_ASSISTANT_ID Or Leave It Empty'
ENV DB_CONN_STR="Your database URL"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
