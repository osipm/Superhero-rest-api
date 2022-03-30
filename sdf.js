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
