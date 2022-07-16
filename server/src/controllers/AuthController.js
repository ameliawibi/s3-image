import model from "../models";

const { User } = model;

export default {
  async getUser(req, res) {
    try {
      const user = await User.findOne({
        where: {
          name: "John",
        },
      });
      if (user) {
        return res
          .status(200)
          .send({ message: "User with that name already exists" });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message:
          "Could not perform operation at this time, kindly try again later.",
      });
    }
  },
};
