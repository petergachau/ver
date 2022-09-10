import express from "express";
import {getMiles,createMile,getMilesByUser, deleteTour, getTour} from '../controllers/milestone.js'
import auth from "../middleware/auth.js";
import MileModal from "../models/milestone.js";

const router = express.Router();

router.post("/", auth, createMile);
router.get("/miles/:id", getMilesByUser);
router.get("/", getMiles);
router.delete("/:id", auth, deleteTour);
router.get("/:id", getTour);

router.get("/search:key", async (req,res)=>{
    let result=await MileModal.find({
      "$or":[
        {
          apartment:{$regex:req.params.key}
          
        }
      ]
    })
    res.send(result)
  });

// router.get("/miles/:id", auth, getMilesByUser);

export default router;
