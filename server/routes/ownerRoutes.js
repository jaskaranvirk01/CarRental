import express from "express";
import { addCar, changeRoleToOwner, deleteCar, getDasboardhData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerControllers.js";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";


const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);
ownerRouter.get("/dashboard", protect, getDasboardhData);
ownerRouter.post("/update-image", upload.single("image"), protect, updateUserImage);


export default ownerRouter;


