const Service = require("../models/Service");
const Joi = require("joi");

class ServiceController {
  async createService(req, res) {

    const schema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      image: Joi.string().required(),
    });

    try {
      const { name, image, price } = req.body;

      const validation = schema.validate({ name, image, price });

      if (validation.error)
        return res.status(400).json({
          message:
            validation.error.details[0].message
              .replace(/['"_]+/g, "")
              .capitalize() + "!",
        });

      let service = await Service.findOne({ name });

      if (service)
        return res.status(400).json({
          message: "Service already exists",
        });

      service = await Service.create({
        name,
        image,
        price,
      });

      return res.status(201).json({
        message: "Service created successfully",
        payload: service,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  async getAllServices(req, res) {
    try {
      const allServices = await Service.find();
      return res.json({
        message: "Got all services",
        payload: allServices,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  async deleteService(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findByIdAndDelete(id);
      return res.json({
        message: "Service deleted successfully",
        payload: service,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  async updateService(req, res) {

    const schema = Joi.object({
      name: Joi.string(),
      price: Joi.number(),
      image: Joi.string(),
    });

    try {
      const { id } = req.params;
      const { name, image, price } = req.body;
      const validation = schema.validate({ name, image, price });
      if (validation.error)
        return res.status(400).json({
          message:
            validation.error.details[0].message
              .replace(/['"_]+/g, "")
              .capitalize() + "!",
        });
      const service = await Service.findByIdAndUpdate(
        id,
        { name, image, price },
        { new: true }
      );
      return res.json({
        message: "Service updated successfully",
        payload: service,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error,
      });
    }
  }
}

module.exports = new ServiceController();
