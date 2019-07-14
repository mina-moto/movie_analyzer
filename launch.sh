docker run -itd \
--name movie_analyzer \
-p 80:3000 \
-v $(pwd)/api:/app timbru31/java-node:latest npm start --prefix /app
