const holidayModel = require('../models/holiday');
const moment = require('moment');

const findAll = async (req, res) => {
  try {
    const holiday = await holidayModel.find().sort({ date: 1 });
    res.status(200).json(holiday);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const findById = async (req, res) => {
  try {
    const holiday = await holidayModel.findById(req.params.id);
    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.status(200).json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findAllUpcomingHolidays = async (req, res) => {
  try {
    const today = moment().startOf('day'); 
    const endOfMonth = today.clone().endOf('month'); 

    const holidays = await holidayModel.find({
      date: {
        $gte: today.toDate(), 
        $lt: endOfMonth.toDate()
      }
    });

    res.status(200).json(holidays);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const add = async (req, res) => {
  try {
    const { name, date, description = '' } = req.body;
    const existingHoliday = await holidayModel.findOne({ name });
    if (existingHoliday) {
      return res.status(404).json({ message: "Holiday Already Added" });
    }
    if (!name || !date) {
      return res.status(400).send({ message: "Fill the required fields" });
    }
    const holiday = new holidayModel({ date, name, description });
    const savedHoliday = await holiday.save();
    res.status(201).send({ message: "Holiday created successfully!", holiday: savedHoliday });
  } catch (error) {
    res.status(500).send(error);
  }
};


const update = async (req, res) => {
  try {
    const { name, date, description, _id } = req.body;
    const holiday = await holidayModel.findByIdAndUpdate(
      _id, 
      { name, date, description },
      { new: true }
    );
    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.status(200).json({ message: "Holiday Updated Successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const { _id } = req.body;
    const holiday = await holidayModel.findByIdAndDelete(_id);
    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.status(200).json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { add, findAll, findById, update, deleteHoliday, findAllUpcomingHolidays };