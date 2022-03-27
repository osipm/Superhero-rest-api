const express = require("express");
const createError = require("http-errors");
const Joi = require("joi");
const superheroes = require("../../models/fnSuperhero");

const superheroSchema = Joi.object({
  nickname: Joi.string().required(),
  real_name: Joi.string().required(),
  origin_description: Joi.string().required(),
  superpowers: Joi.string().required(),
  catch_phrase: Joi.string().required(),
  Images: Joi.string().required(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await superheroes.getAll();
    res.json(result);
  } catch (error) {
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

router.post("/", async (req, res, next) => {
  try {
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
      Images,
    } = req.body;
    const result = await superheroes.add(
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      Images
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
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
      Images,
    } = req.body;
    const result = await superheroes.updateById(
      id,
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      Images
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