import express from 'express';
import { getAnimals, getAnimalById } from '../controllers/animalController.js';

const router = express.Router();

router.get('/', getAnimals);
router.get('/:id', getAnimalById);

export default router;
