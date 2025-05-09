const fs = require('fs');
const path = require('path');
const State = require('../model/State');
const filePath = path.join(__dirname, '../model/statesData.json');
// Array of state codes in the .json file
const rawJson = require('../model/statesData.json');
// For use with stateCodes below, using filePath instead does not work!
const stateCodes = rawJson.map(state => state.code);
// Bring in statesData.json as const 'data'
const data = {
    states: require('../model/statesData.json'),
    setStateData: function (data) { this.states = data }
}
// Get a random element for any array
function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
// Format pop. number with separating commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const getAllStates = async (req, res) => { 
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let filteredStates = jsonData;
    const contiguous = req.query.contig;
    if (contiguous === 'true') {
        try {
            filteredStates = jsonData.filter(
                state => state.code !== 'AK' && state.code !== 'HI'
            );
            const dbStates = await State.find();
            // Convert MongoDB array to lookup object: { KS: ["...", "..."], CA: [...] }
            const funFactMap = {};
            dbStates.forEach(state => {
                if (state.stateCode && state.funfacts) {
                    funFactMap[state.stateCode] = state.funfacts;
                }
            });
            // Merge funfacts to matching state in .json
            const mergedStates = filteredStates.map(state => {
                const facts = funFactMap[state.code];
                return {
                ...state,
                ...(facts && { funfacts: facts }) // only include funfacts if exist
                };
            });
            res.json(mergedStates);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    } else if (contiguous === 'false') {
        try {
            filteredStates = jsonData.filter(
                state => state.code === 'AK' || state.code === 'HI'
            );
            const dbStates = await State.find();
            // Convert MongoDB array to lookup object: { KS: ["...", "..."], CA: [...] }
            const funFactMap = {};
            dbStates.forEach(state => {
                if (state.stateCode && state.funfacts) {
                    funFactMap[state.stateCode] = state.funfacts;
                }
            });
            // Merge funfacts to matching state in .json
            const mergedStates = filteredStates.map(state => {
                const facts = funFactMap[state.code];
                return {
                ...state,
                ...(facts && { funfacts: facts }) // only include funfacts if exist
                };
            });
            res.json(mergedStates);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        try {
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const dbStates = await State.find();
            // Convert MongoDB array to lookup object: { KS: ["...", "..."], CA: [...] }
            const funFactMap = {};
            dbStates.forEach(state => {
                if (state.stateCode && state.funfacts) {
                    funFactMap[state.stateCode] = state.funfacts;
                }
            });
            // Merge funfacts to matching state in .json
            const mergedStates = jsonData.map(state => {
                const facts = funFactMap[state.code];
                return {
                ...state,
                ...(facts && { funfacts: facts }) // only include funfacts if exist
                };
            });
            res.json(mergedStates);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

const getState = async (req, res) => {
    // // Grabs two character state code
    // const stateCode = req.params.state.toUpperCase();
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        statesData = JSON.parse(data);
        const stateDoc = await State.findOne({ stateCode: stateCode });
        const state = statesData.find(st => st.code === stateCode);
        if (!state) {
            return res.status(400).json({ "message": 'Invalid state abbreviation parameter' });
        }
        if (stateDoc && stateDoc.funfacts && stateDoc.funfacts.length > 0) {
            state.funfacts = stateDoc.funfacts;
        }
        res.json(state);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
}

const getStateCapital = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        statesData = JSON.parse(data);
        const stateDoc = await State.findOne({ stateCode: stateCode });
        const state = statesData.find(st => st.code === stateCode);
        if (!state) {
            return res.status(400).json({ "message": 'Invalid state abbreviation parameter' });
        }
        if (stateDoc && stateDoc.funfacts && stateDoc.funfacts.length > 0) {
            state.funfacts = stateDoc.funfacts;
        }
        res.json({ 'state': state.state, 'capital': state.capital_city});
        
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
}

const getStateNickname = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        statesData = JSON.parse(data);
        const stateDoc = await State.findOne({ stateCode: stateCode });
        const state = statesData.find(st => st.code === stateCode);
        if (!state) {
            return res.status(400).json({ "message": 'Invalid state abbreviation parameter' });
        }
        if (stateDoc && stateDoc.funfacts && stateDoc.funfacts.length > 0) {
            state.funfacts = stateDoc.funfacts;
        }
        res.json({ 'state': state.state, 'nickname': state.nickname});
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
}

const getStatePopulation = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        statesData = JSON.parse(data);
        const stateDoc = await State.findOne({ stateCode: stateCode });
        const state = statesData.find(st => st.code === stateCode);
        if (!state) {
            return res.status(400).json({ "message": 'Invalid state abbreviation parameter' });
        }
        if (stateDoc && stateDoc.funfacts && stateDoc.funfacts.length > 0) {
            state.funfacts = stateDoc.funfacts;
        }
        const formattedPopulation = numberWithCommas(state.population);
        res.json({ 'state': state.state, 'population': formattedPopulation});
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
}

const getStateAdmission = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        statesData = JSON.parse(data);
        const stateDoc = await State.findOne({ stateCode: stateCode });
        const state = statesData.find(st => st.code === stateCode);
        if (!state) {
            return res.status(400).json({ "message": 'Invalid state abbreviation parameter' });
        }
        if (stateDoc && stateDoc.funfacts && stateDoc.funfacts.length > 0) {
            state.funfacts = stateDoc.funfacts;
        }
        res.json({ 'state': state.state, 'admitted': state.admission_date});
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
}

const getFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const data = fs.readFileSync(filePath, 'utf-8');
    const statesData = JSON.parse(data);
    const state = statesData.find(st => st.code === stateCode);
    if (!state) return res.status(400).json({ 'message' : 'Invalid state abbreviation parameter' });
    const stateName = state.state;
    // existingState is the document in Mongodb that matches URL parameter stateCode
    const existingState = await State.findOne({ stateCode: stateCode });
    if (!existingState) return res.status(404).json({ 'message' : `No Fun Facts found for ${stateName}` });

    const randomFunFact = getRandomElement(existingState.funfacts);

    res.json({ 'funfact': randomFunFact});
}

const createNewFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const funfacts = req.body.funfacts;
    if (!funfacts) {
        // Request body has no funfacts property
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }
    if (funfacts.length === 0) {
        // Request body's funfacts property is empty
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        // Request body's funfacts property does not have an array value attached
        return res.status(400).json({ 'message': 'State fun facts value must be an array' })
    }
    try {
        const existingState = await State.findOne({ stateCode: stateCode });
        if (existingState) {
            existingState.funfacts = existingState.funfacts.concat(funfacts);
            const result = await existingState.save();
            res.status(201).json(result);
        } else {
            State.insertOne({ stateCode: stateCode, funfacts: funfacts})
                .then(result => {
                    res.status(201).json(result)
                });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
}

const deleteFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const index = req.body.index;
    // Validate index provided
    if (index === undefined) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    // Validate state exists
    const stateFromJson = rawJson.find(st => st.code === stateCode);
    if (!stateFromJson) {
        return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
    }
    const stateName = stateFromJson.state;
    try {
        const stateDoc = await State.findOne({ stateCode: stateCode });
        // No MongoDB document for this state
        if (!stateDoc || !Array.isArray(stateDoc.funfacts) || stateDoc.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
        }
        // Convert 1-based index provided in request body to 0-based for use in MongoDB
        const oneBasedIndex = parseInt(index);
        const zeroBasedIndex = oneBasedIndex - 1;
        // Index is out of bounds
        if (isNaN(oneBasedIndex) || zeroBasedIndex < 0 || zeroBasedIndex >= stateDoc.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateName}` });
        }
        // Remove the fun fact at given index
        stateDoc.funfacts.splice(zeroBasedIndex, 1);
        const result = await stateDoc.save();
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error while deleting fun fact' });
    }
};

const updateFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index, funfact } = req.body;
    // Get the proper state name from static JSON
    const stateName = rawJson.find(state => state.code === stateCode)?.state || stateCode;
    // Validate index
    if (index === undefined) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    const parsedIndex = parseInt(index);
    if (isNaN(parsedIndex) || parsedIndex < 1) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    // Validate funfact
    if (!funfact || typeof funfact !== 'string') {
        return res.status(400).json({ message: 'State fun fact value required' });
    }
    // Fetch from MongoDB
    const stateDoc = await State.findOne({ stateCode });
    if (!stateDoc || !Array.isArray(stateDoc.funfacts) || stateDoc.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
    }
    const zeroBasedIndex = parsedIndex - 1;
    if (zeroBasedIndex < 0 || zeroBasedIndex >= stateDoc.funfacts.length) {
        return res.status(404).json({ message: `No Fun Fact found at that index for ${stateName}` });
    }
    // Perform the update
    stateDoc.funfacts[zeroBasedIndex] = funfact;
    const result = await stateDoc.save();
    return res.json(result);
};

module.exports = {
    getFunFact,
    createNewFunFact,
    updateFunFact,
    deleteFunFact,
    getFunFact,
    getAllStates,
    getState,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission
}