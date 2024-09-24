const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

class AuthController {
  async signUp(req, res) {
    const saltRounds = 10;
    const { first_name, last_name, phone, age, avatar, password } = req.body;

    const schema = Joi.object({
      phone: Joi.string().min(13).max(13).required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      password: Joi.string().min(5).required(),
    });

    try {
      const validation = schema.validate({
        first_name,
        last_name,
        phone,
        password,
      });

      if (validation.error)
        return res.status(400).json({
          message:
            validation.error.details[0].message
              .replace(/['"_]+/g, "")
              .capitalize() + "!",
        });

      let user = await User.findOne({ phone });

      if (user)
        return res.status(400).json({
          message: "User alredy exist!",
        });

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      user = await User.create({
        first_name,
        last_name,
        phone,
        age,
        avatar,
        password: hash,
      });

      if (user) {
        return res.status(201).json({
          message: "New user created!",
          payload: user,
        });
      }

      return res.status(500).json({
        message: "User couldn't be created",
      });
    } catch (error) {
      res.json({
        message: error,
      });
    }
  }

  async signIn(req, res){
    const { phone, password } = req.body;

  const schema = Joi.object({
    phone: Joi.string().min(13).max(13).required(),
    password: Joi.string().min(5).required(),
  });

  try {
    const validation = schema.validate({ phone, password });

    if (validation.error)
      return res.status(400).json({
        message:
          validation.error.details[0].message
            .replace(/['"_]+/g, "")
            .capitalize() + "!",
      });

    const JWT_SECRET = process.env.JWT_SECRET;
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ message: "User not found!" });

    let result = bcrypt.compareSync(password, user.password);

    if (!result)
      return res.status(401).json({
        message: "Phone number or password is incorrect",
      });

    let token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "15d",
    });

    return res.json({
      message: "User found",
      payload: { user, token },
    });
  } catch (error) {
    res.json({
      message: error
    });
  }
  }

  async getProfile(req, res){
    const {id} = req.user;
    try {
      const user = await User.findById(id);
      return res.json({
        message: "Got profile data",
        payload: user,
      });
    } 
    catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  async updateProfile(req, res){

    const schema = Joi.object({
        phone: Joi.string().min(13).max(13),
        first_name: Joi.string(),
        last_name: Joi.string(),
        avatar: Joi.string()
    });


    const { id } = req.user;
    const { first_name, last_name, avatar, phone } = req.body;

    const validation = schema.validate({
        first_name,
        last_name,
        phone,
        avatar,
    });
    try {
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
                .replace(/['"_]+/g, "")
                .capitalize() + "!",
            })
        }

        const user = await User.findByIdAndUpdate(id, {first_name, last_name, avatar, phone}, {new: true});
        if(user){
        return res.status(200).json({
            message: "Successfully updated profile data!",
            payload: user,
        });
      }
      return res.status(500).json({
        message: "Something went wrong!"
      });
    } 
    catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }
}


module.exports = new AuthController();