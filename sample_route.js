router.post("/submitart", upload.single("image"), async (req, res) => {
  try {
    let artSubmissionInfo = req.body;
    if (!artSubmissionInfo.artTitle) {
      res.status(400).render("../views/pages/create", {
        error: "You must provide a title for your art",
      });
      return;
    }
    if (typeof artSubmissionInfo.artTitle !== "string") {
      res.status(400).render("../views/pages/create", {
        error: "Title must be a string",
      });
      return;
    }
    if (artSubmissionInfo.artTitle.trim().length === 0) {
      res.status(400).render("../views/pages/create", {
        error: "Title cannot be an empty string or string with just spaces",
      });
      return;
    }
    artSubmissionInfo.artTitle = artSubmissionInfo.artTitle.trim();
    if (!artSubmissionInfo.artDescription) {
      res.status(400).render("../views/pages/create", {
        error: "You must provide a description for your art",
      });
      return;
    }
    if (typeof artSubmissionInfo.artDescription !== "string") {
      res.status(400).render("../views/pages/create", {
        error: "Description must be a string",
      });
      return;
    }
    if (artSubmissionInfo.artDescription.trim().length === 0) {
      res.status(400).render("../views/pages/create", {
        error:
          "Description cannot be an empty string or string with just spaces",
      });
      return;
    }
    artSubmissionInfo.artDescription = artSubmissionInfo.artDescription.trim();
    if (artSubmissionInfo.forSale === "on") {
      artSubmissionInfo.setPrice = parseFloat(artSubmissionInfo.setPrice);
      artSubmissionInfo.setPrice = artSubmissionInfo.setPrice.toFixed(2);
      if (!artSubmissionInfo.setPrice) {
        res.status(400).render("../views/pages/create", {
          error: "Must provide a price",
        });
        return;
      }
      if (typeof artSubmissionInfo.setPrice !== "number") {
        res.status(400).render("../views/pages/create", {
          error: "Price must be a number",
        });
        return;
      }
      if (artSubmissionInfo.setPrice < 0) {
        res.status(400).render("../views/pages/create", {
          error: "Price cannot be negative",
        });
        return;
      }
    }
    if (!artSubmissionInfo.typeGenre) {
      res.status(400).render("../views/pages/create", {
        error: "You must provide a genre for your art",
      });
      return;
    }
    if (typeof artSubmissionInfo.typeGenre !== "string") {
      res.status(400).render("../views/pages/create", {
        error: "Genre must be a string",
      });
      return;
    }
    if (artSubmissionInfo.typeGenre.trim().length === 0) {
      res.status(400).render("../views/pages/create", {
        error: "Genre cannot be an empty string or string with just spaces",
      });
      return;
    }
    artSubmissionInfo.typeGenre = artSubmissionInfo.typeGenre.trim();
    const result = await cloudinary.uploader.upload(req.file.path);
    const newArtSubmission = await artItemApi.createArtItem(
      xss(req.session.userId),
      xss(artSubmissionInfo.artTitle),
      xss(artSubmissionInfo.artDescription),
      xss(artSubmissionInfo.forSale),
      xss(artSubmissionInfo.setPrice),
      0,
      xss(artSubmissionInfo.typeGenre),
      result.secure_url,
      result.public_id
    );
    res.status(200).redirect("/item/" + newArtSubmission._id);
  } catch (e) {
    res.status(400).render("../views/pages/error", { error: e });
  }
});
