cd frontend
ng serve --port 4200 --host 0.0.0.0 --disable-host-check &
cd ../backend
fastapi run main.py --port 8000
