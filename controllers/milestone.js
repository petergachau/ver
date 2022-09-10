import MileModal from "../models/milestone.js";
import mongoose from "mongoose";

export const createMile = async (req, res) => {
  const tour = req.body;
  const newTour = new MileModal({
    ...tour,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getMiles = async (req, res) => {
  const { page } = req.query;
  try {
    // const tours = await MileModal.find();
    // res.status(200).json(tours);

    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    const total = await MileModal.countDocuments({});
    const tours = await MileModal.find().limit(limit).skip(startIndex);
    res.json({
      data: tours,
      currentPage: Number(page),
      totalTours: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await MileModal.findById(id);
    res.status(200).json(tour);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getMilesByUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  const userTours = await MileModal.find({ creator: id });
  res.status(200).json(userTours);
};

export const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id: ${id}` });
    }
    await MileModal.findByIdAndRemove(id);
    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id: ${id}` });
    }

    const updatedTour = {
      creator,
      title,
      description,
      tags,
      imageFile,
      _id: id,
    };
    await MileModal.findByIdAndUpdate(id, updatedTour, { new: true });
    res.json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getToursBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const tours = await MileModal.find({ title });
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getToursByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const tours = await MileModal.find({ tags: { $in: tag } });
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getRelatedTours = async (req, res) => {
  const tags = req.body;
  try {
    const tours = await MileModal.find({ tags: { $in: tags } });
    res.json(tours);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const likeTour = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return res.json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No tour exist with id: ${id}` });
    }

    const tour = await MileModal.findById(id);

    const index = tour.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      tour.likes.push(req.userId);
    } else {
      tour.likes = tour.likes.filter((id) => id !== String(req.userId));
    }

    const updatedTour = await MileModal.findByIdAndUpdate(id, tour, {
      new: true,
    });

    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
