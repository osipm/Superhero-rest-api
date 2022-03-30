const express = require("express");
const createError = require("http-errors");
const Joi = require("joi");
const superheroes = require("../../models/fnSuperhero");
const upload = require("../../midelware/upload");
const fs = require("fs/promises");
const path = require("path");

const superheroSchema = Joi.object({
  nickname: Joi.string().required(),
  real_name: Joi.string(),
  origin_description: Joi.string(),
  superpowers: Joi.string(),
  catch_phrase: Joi.string(),
  Images: Joi.string(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await superheroes.getAll();
    res.json(result);
  } catch (error) {
    r;
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await superheroes.getById(id);
    if (!result) {
      throw new createError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});
const superheroDir = path.join("image");

router.post("/", upload.single("image"), async (req, res, next) => {
  const { path: tempUpload, filename } = req.file;

  try {
    const resultUpload = path.join(superheroDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const Image = path.join(filename);

    const { error } = superheroSchema.validate(req.body);
    if (error) {
      throw new createError(400, error.message);
    }

    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    } = req.body;

    const result = await superheroes.add(
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      Image
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", upload.single("image"), async (req, res, next) => {
  const { path: tempUpload, filename } = req.file;
  try {
    const resultUpload = path.join(superheroDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const Image = path.join(filename);

    const { error } = superheroSchema.validate(req.body);
    if (error) {
      throw new createError(400, error.message);
    }
    const { id } = req.params;
    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    } = req.body;
    const result = await superheroes.updateById(
      id,
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      Image
    );
    if (!result) {
      throw new createError(404, "Not found");
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await superheroes.removeById(id);
    if (!result) {
      throw new createError(404, "Not found");
    } else {
      res.json({ message: "Superhero deleted" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
