const express = require('express');
const mongoose = require("mongoose");
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//Connect Database
var mongoDB = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wapcc.mongodb.net/translatorDB`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

//Database Schema

const translatorSchema = mongoose.Schema({
    sourceCode: String,
    targetCode: String,
    sourceData: String,
    targetData: String
});

const Translator = mongoose.model("Translator", translatorSchema);

// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

let flag = false;
let sourceLan = "";
let targetLan = "";
let sourceText = "";
let targetText = "";

const detectLanguage = async (text) => {

    try {
        let response = await translate.detect(text);
        return response[0].language;
    } catch (error) {
        console.log(`Error at detectLanguage --> ${error}`);
        return 0;
    }
}

const translateText = async (text, targetLanguage) => {

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

let allLanguages = {};

app.get('/', async (req, res) => {
    const [languages] = await translate.getLanguages();
    languages.map((e) => {
        allLanguages[e.code] = e.name;
    });
    res.render('Main', { languages: languages, flag: flag, sourceLan: allLanguages[sourceLan], targetLan: allLanguages[targetLan], sourceText: sourceText, targetText: targetText });
    flag = false
});

app.post('/', async (req, res) => {
    targetLan = req.body.target;
    sourceText = req.body.source_text;

    const cache = await Translator.findOne({
        sourceData: sourceText,
        targetCode: targetLan
    });

    if (cache) {
        flag = true;
        sourceLan = cache.sourceCode;
        sourceText = cache.sourceData;
        targetLan = cache.targetCode;
        targetText = cache.targetData;
        res.redirect('/');
    } else {
        await detectLanguage(sourceText)
            .then((res) => {
                sourceLan = res;
            })
            .catch((err) => {
                console.log(err);
            });

        await translateText(sourceText, targetLan)
            .then((response) => {
                flag = true;
                targetText = response;
                res.redirect('/');
            })
            .catch((err) => {
                console.log(err);
            });

        const data = new Translator({
            sourceCode: sourceLan,
            targetCode: targetLan,
            sourceData: sourceText,
            targetData: targetText
        })

        await data.save()
    }


});

app.listen(port, () => {
    console.log(`Web app listening at port:${port}`)
});