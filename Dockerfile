FROM nikolaik/python-nodejs:python3.12-nodejs21-slim-canary

WORKDIR /code

COPY ./backend/requirements.txt /code/backend/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/backend/requirements.txt

# 


COPY ./backend/main.py /code/backend
COPY ./run.sh /code

# 


COPY ./frontend /code/

WORKDIR /code/frontend
RUN npm install -g @angular/cli@15.0.0
RUN npm install @angular-devkit/build-angular

WORKDIR /code/
CMD ["bash", "run.sh"]