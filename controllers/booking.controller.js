const Joi = require("joi");
const Booking = require("../models/Booking");

class BookingController{
    async createOrder(req, res){

        const schema = Joi.object({
            date: Joi.string().required(),
            start: Joi.string().required(),
            end: Joi.string().required(),
            service: Joi.array().required(),
            barber: Joi.string().required(),
            comment: Joi.string(),
            price: Joi.number().required()
         })

        try{
            const {date, start, end, service, barber, comment, price } = req.body;
            const {id} = req.user;

            const validation = schema.validate({ date, start, end, service,barber,comment, price });

            if (validation.error)
                return res.status(400).json({
                    message:
                      validation.error.details[0].message
                        .replace(/['"_]+/g, "")
                        .capitalize() + "!",
                });

            let booking = await Booking.findOne({ date, start, end, barber });

            if(booking) return res.status(400).json({
                message: "Booking already exists"
            })

            booking = await Booking.create({ date, start, end, service, client: id, barber, comment, price });
            
            return res.status(201).json({
                message: "Booking created successfully",
                payload: booking
            })
        }
        catch(error){
            console.log(error)
            res.status(500).json({
                message: error
            })
        }
    }

    async getBookings(req, res){
        try{
            const bookings = await Booking.find().populate("service").populate("barber").populate("client");
            return res.json({
                message: "Got all bookings",
                payload: bookings
            })
        }
        catch(error){
            res.status(500).json({
                message: error
            })
        }
    }
}

module.exports = new BookingController();