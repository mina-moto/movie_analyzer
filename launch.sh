docker run -itd \
--name movie_analyzer \
-p 80:3000 \
-v $(pwd)/api:/app movie_analyzer:latest npm start --prefix /app
