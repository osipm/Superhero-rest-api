router.post("/", upload.single("image"), async (req, res, next) => {
  // console.log(req.file);

  const { path: tempUpload, filename } = req.file;

  try {
    const resultUpload = path.join(superheroDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const Image = path.join("image", filename);

    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    } = req.body;

    console.log(
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      Image
    );
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
    await fs.unlink(tempUpload);
  }
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
