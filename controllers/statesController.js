const fs = require('fs');
const path = require('path');
const State = require('../model/State');
// const stateCodes = require('../middleware/verifyStates');
const filePath = path.join(__dirname, '../model/statesData.json');
//Array of state codes in the .json
const rawJson = require('../model/statesData.json');
//For use with stateCodes below, using filePath instead does not work!
const stateCodes = rawJson.map(state => state.code);
//Bring in statesData.json as const 'data'
const data = {
    states: require('../model/statesData.json'),
    setStateData: function (data) { this.states = data }
}
//Get a random element for array
function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
//Format pop number with separating commas
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
            // Load JSON state data
            // const filePath = path.join(__dirname, '../model/statesData.json');
            //// const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            // Get all MongoDB fun fact entries
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
            // Load JSON state data
            // const filePath = path.join(__dirname, '../model/statesData.json');
            // const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            // Get all MongoDB fun fact entries
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
            // Load JSON state data
            // const filePath = path.join(__dirname, '../model/statesData.json');
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            // Get all MongoDB fun fact entries
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

//Create from .json,, maybe not needed?
// const createNewEmployee = (req, res) => {
//     const newEmployee = {
//         id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
//         firstname: req.body.firstname,
//         lastname: req.body.lastname
//     }


//     if (!newEmployee.firstname || !newEmployee.lastname) {
//         return res.status(400).json({ 'message': 'First and last names are required.' });
//     }

//     data.setEmployees([...data.employees, newEmployee]);
//     res.status(201).json(data.employees);
// }

//Update from .json,, maybe not needed?
// const updateEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
//     }
//     if (req.body.firstname) employee.firstname = req.body.firstname;
//     if (req.body.lastname) employee.lastname = req.body.lastname;
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     const unsortedArray = [...filteredArray, employee];
//     data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
//     res.json(data.employees);
// }

//Delete from .json,, maybe not needed??
// const deleteEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
//     }
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     data.setEmployees([...filteredArray]);
//     res.json(data.employees);
// }

//Get one from .json
const getState = async (req, res) => {
    //Url.com/states/:state<== the below grabs this value
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
        res.json(state);
        
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
}

const getStateCapital = async (req, res) => {
    //Url.com/states/:state<== the below grabs this value
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
    //Url.com/states/:state<== the below grabs this value
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
    //Url.com/states/:state<== the below grabs this value
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
    //Url.com/states/:state<== the below grabs this value
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
    //Url.com/states/:state<== the below grabs this value
    const stateCode = req.params.state.toUpperCase();
    const data = fs.readFileSync(filePath, 'utf-8');
    const statesData = JSON.parse(data);
    const state = statesData.find(st => st.code === stateCode);
    if (!state) return res.status(400).json({ 'message' : 'Invalid state abbreviation parameter' });
    const stateName = state.state;
    
    //existingState is the doc in Mongodb that matches URL parameter stateCode
    const existingState = await State.findOne({ stateCode: stateCode });
    if (!existingState) return res.status(404).json({ 'message' : `No Fun Facts found for ${stateName}` });

    const randomFunFact = getRandomElement(existingState.funfacts);

    res.json({ 'funfact': randomFunFact});
}

const createNewFunFact = async (req, res) => {
    //Url.com/states/:state<== the below grabs this value
    const stateCode = req.params.state.toUpperCase();
    const funfacts = req.body;

    //fix this
    if (funfacts.length === 0) {
        return res.status(400).json({ 'message': 'State fun facts value required'});
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' })
    }

    try {
        const existingState = await State.findOne({ stateCode: stateCode });

        if (existingState) {
            existingState.funfacts = existingState.funfacts.concat(funfacts);
            const result = await existingState.save();
            res.status(201).json(result);
        } else {
            const newFunFact = await State.insertOne({ stateCode: stateCode, funfacts: funfacts})
                .then(result => {
                    res.status(201).json(result)
                });
            // return res.status(201).json({'message': 'lol sure'});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
}

const updateFunFact = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteFunFact = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ${req.body.id}.` });
    }
    const result = await employee.deleteOne({ _id: req.body.id });
    res.json(result);
}
//This p[rolly sux idk]
// const getFunFact = async (req, res) => {
//     if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

//     const employee = await Employee.findOne({ _id: req.params.id }).exec();
//     if (!employee) {
//         return res.status(204).json({ "message": `No employee matches ${req.params.id}.` });
//     }
//     res.json(employee);
// }

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