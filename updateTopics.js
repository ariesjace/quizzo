const fs = require("fs");

const data = JSON.parse(fs.readFileSync("questions.json", "utf-8"));

const updated = data.map(q => ({
  ...q,
  topic: "Topic 2: Thyroid Gland – Anatomy & Biosynthesis"
}));

fs.writeFileSync("questions_updated.json", JSON.stringify(updated, null, 2));