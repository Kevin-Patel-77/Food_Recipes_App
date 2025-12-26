const fs = require("fs");
const po2json = require("po2json");
const json2po = require("json2po");
const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

async function translatePo(inputPath, outputPath, targetLang) {
  const poJson = po2json.parseFile(inputPath, { format: "jed1.x" });

  for (let key in poJson) {
    if (!poJson[key]) {
      const [translation] = await translate.translate(key, targetLang);
      poJson[key] = translation;
    }
  }

  const poContent = json2po.stringify(poJson);
  fs.writeFileSync(outputPath, poContent, "utf8");
  console.log("Translation complete!");
}

translatePo(
  "./src/locales/fr/messages.po",
  "./src/locales/fr/messages.po",
  "fr"
);
