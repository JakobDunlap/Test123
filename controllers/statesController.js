const fs = require('fs');
const path = require('path');
const State = require('../model/State');
const stateCodes = require('../middleware/verifyStates');
const filePath = path.join(__dirname, '../model/statesData.json');
//Bring in statesData.json as const 'data'
// const data = {
//     states: require('../model/statesData.json'),
//     setStateData: function (data) { this.states = data }
// }

const getAllStates = async (req, res) => { 
  try {
    // Load JSON state data
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
    res.status(500).json({ 'message': err.message });
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
const getState = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    let statesData;
    
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        statesData = JSON.parse(data);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ 'message': err.message });
    }
    const state = statesData.find(st => st.code === stateCode);
    if (!state) {
        return res.status(400).json({ "message": 'Invalid state abbreviation parameter' });
    }
    return res.json(state);
}

const getAllFunFacts = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message' : 'No employees found.'});
    res.json(employees);
}

const createNewFunFact = async (req, res) => {
    const { stateCode, funfacts } = req.body;

    if (!stateCode) {
        return res.status(400).json({ 'message': 'State code required'});
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' })
    }

    try {
        const existingState = await State.findOne({ stateCode: stateCode.toUpperCase() });

        if (existingState) {
            existingState.funfacts = existingState.funfacts.concat(funfacts);
            const result = await existingState.save();
            return res.status(200).json(result); //maybe should be 201
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

const getFunFact = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ${req.params.id}.` });
    }
    res.json(employee);
}

module.exports = {
    getAllFunFacts,
    createNewFunFact,
    updateFunFact,
    deleteFunFact,
    getFunFact,
    getAllStates,
    getState
}