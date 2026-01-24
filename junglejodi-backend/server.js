import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_PATH = path.join(__dirname, 'data', 'animals.json');

app.use(cors());
app.use(express.json());

// Helper to read data
const readData = () => {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// API: Get all profiles
app.get('/api/profiles', (req, res) => {
    const animals = readData();
    res.json(animals);
});

// API: Create profile
app.post('/api/profiles', (req, res) => {
    const animals = readData();
    const newAnimal = { id: Date.now().toString(), ...req.body };
    animals.push(newAnimal);
    writeData(animals);
    res.status(201).json(newAnimal);
});

// API: Matchmaking
app.get('/api/matches/:id', (req, res) => {
    const animals = readData();
    const user = animals.find(a => a.id === req.params.id);

    if (!user) return res.status(404).json({ error: 'Animal not found' });

    const matches = animals.filter(a => {
        if (a.id === user.id) return false;

        // Predator-Prey Logic (simplified for now)
        // If one is carnivore and other is herbivore -> Risk!
        const isPredatorRisk = (user.foodHabit === 'carnivore' && a.foodHabit === 'herbivore') ||
            (user.foodHabit === 'herbivore' && a.foodHabit === 'carnivore');

        if (isPredatorRisk) return false;

        // Match based on habitat and activity
        const habitatMatch = a.habitat === user.habitat;
        const activityMatch = a.activityTime === user.activityTime;

        return habitatMatch || activityMatch;
    }).map(a => {
        let score = 0;
        if (a.habitat === user.habitat) score += 40;
        if (a.activityTime === user.activityTime) score += 30;
        if (a.foodHabit === user.foodHabit) score += 30;
        return { ...a, compatibility: score };
    });

    res.json(matches.sort((a, b) => b.compatibility - a.compatibility));
});

// API: Interaction
app.post('/api/interact', (req, res) => {
    const { type, matchName } = req.body;
    let message = '';

    switch (type) {
        case 'Tree-top Swing':
            message = `🌿 You and ${matchName} spent the afternoon swinging through the canopy! The forest approves this bond!`;
            break;
        case 'Riverbank Walk':
            message = `🌊 A peaceful stroll by the river with ${matchName}. Your connection deepens with the flow of the water.`;
            break;
        case 'Moonlight Hunt':
            message = `🌙 The stars witness your shared journey with ${matchName}. A night to remember!`;
            break;
        default:
            message = `🍃 You spent some quality time in the forest with ${matchName}.`;
    }

    res.json({ message });
});

app.listen(PORT, () => {
    console.log(`JungleJodi Backend running on http://localhost:${PORT}`);
});
