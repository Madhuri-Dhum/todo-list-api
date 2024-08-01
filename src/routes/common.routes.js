const express = require("express");
const router = express.Router();
const multer = require("multer");
const csvParser = require("csv-parser");
const path = require("path");
const fs = require("fs");
const { Parser } = require("json2csv");
const todoController = require("../controllers/todo.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/upload-csv", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.statusCode = 400;
      throw error;
    }

    const csvFilePath = req.file.path;

    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const userId = req.user._id;

        const todos = results
          .filter(
            (row) => row.description.trim() !== "" || row.title.trim() !== ""
          )
          .map((row) => ({
            description: row.description,
            userId: userId,
          }));

        const insertedData = await todoController.createTodos(todos);

        fs.unlink(csvFilePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });

        res
          .status(200)
          .json({ message: "CSV processed successfully", data: insertedData });
      });
  } catch (error) {
    next(error);
  }
});

router.get("/download-csv", async (req, res, next) => {
  try {
    const todos = await todoController.getAllTodos();

    const transformedData = todos.map((item) => ({
      description: item.description,
      status: item.status,
    }));

    const json2csvParser = new Parser();

    const csv = json2csvParser.parse(transformedData);

    res.setHeader("Content-Disposition", "attachment: filename=todos.csv");

    res.setHeader("Content-Type", "text/csv");

    res.status(200).end(csv);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
