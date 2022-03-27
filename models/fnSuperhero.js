const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const filePath = path.join(__dirname, "superhero.json");

const getAll = async () => {
  const data = await fs.readFile(filePath);
  const superhero = JSON.parse(data);
  return superhero;
};

const getById = async (id) => {
  const superhero = await getAll();
  const result = superhero.find((item) => item.id === id);
  if (!result) {
    return null;
  }
  return result;
};

const add = async (
  nickname,
  real_name,
  origin_description,
  superpowers,
  catch_phrase,
  Images
) => {
  const data = {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    Images,
    id: v4(),
  };
  const superheroes = await getAll();
  superheroes.push(data);
  await fs.writeFile(filePath, JSON.stringify(superheroes, null, 2));
  return data;
};

const updateById = async (
  id,
  nickname,
  real_name,
  origin_description,
  superpowers,
  catch_phrase,
  Images
) => {
  const superheroes = await getAll();
  const idx = superheroes.findIndex((item) => item.id === id);
  if (idx === -1) {
    return null;
  }
  superheroes[idx] = {
    id,
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    Images,
  };
  await fs.writeFile(filePath, JSON.stringify(superheroes, null, 2));

  return superheroes[idx];
};

const removeById = async (id) => {
  const superheroes = await getAll();
  const idx = superheroes.findIndex((item) => item.id === id);
  if (idx === -1) {
    return null;
  }
  const deleteSuperhero = superheroes[idx];
  superheroes.splice(idx, 1);
  await fs.writeFile(filePath, JSON.stringify(superheroes, null, 2));

  return deleteSuperhero;
};

module.exports = { getAll, getById, add, updateById, removeById };
