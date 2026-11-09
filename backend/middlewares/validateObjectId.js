// Rejects malformed ids with a 400 instead of letting Mongoose throw a CastError (500).
const OBJECT_ID = /^[a-f\d]{24}$/i;

const validateObjectId = (param = "id") => (req, res, next) => {
  if (!OBJECT_ID.test(String(req.params[param] ?? ""))) {
    return res.status(400).json({ message: "Invalid id.", success: false });
  }
  next();
};

export default validateObjectId;
