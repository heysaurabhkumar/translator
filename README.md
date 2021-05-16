# Translator Node Web App

## Task

1. Create a web server with a RESTful API to translate a text from one language to another.

2. For the actual translation, you can use an external service like Google Translate or Bing Translations. The source and target language should be definable via the API.

3. In addition, we want to cache (store in Database) translations, in order to avoid repeated hits to the translation API. The cache must be persistent!

4. The server should have an extensible architecture. E.g. We may want to change our caching strategy or switch out our translation service.

## Bonus Tasks

1. As a bonus task, implement smart pre-caching. This means we assume that if a user translates a text into Kannada, he is likely to also translate the same text to Hindi. Therefore we want to not only request Kannada from the external service but also other languages like Hindi, Tamil, etc. and store it in our cache.

2. The smart caching should not affect the response time of the translation API.

## Technogies Used

1. NodeJS (express) for backend

2. MongoDB (mongoose) for database

## To run it on localhost

1. Download this repo and unzip it.

2. Open translator directory in terminal.

3. Run "npm install".

4. Run "touch .env" (Create .env file)

5. Run "code ." (Open project in vs code)

6. Open .env in vs code.

7. You need to provide three things here.

   1. DB_USERNAME (database username)

   2. DB_PASSWORD (database password)

   3. CREDENTIALS (google cloud translate api credentials)

8. Run "node index.js".

9. Open browser and hit <http://localhost:3000/>.

## Packages Used

1. express

2. ejs

3. dotenv

4. mongoose

## Methodology

1. On selecting target language and entering the input text, It will first check whether it is present is database or not.

2. If it is present in database then it will fetch output from the database and displays to user.

3. If not present in database then it will call google cloud translate api and fetch result from there.

4. And after fetching result, it will store that in database and displays to user.

5. In this way, I have minimized the google cloud translate api call.

## Evaluation

1. I have implemented the cache concept by using mongoDB database. So, It can be improved further by implementing smart pre-caching concept.

2. I have used ejs for creating frontend. So the frontend can be improved further using ReactJS.
