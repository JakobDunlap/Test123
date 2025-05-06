const statesData = require('../model/statesData.json');

const stateCodes = statesData.map(state => state.code);

const verifyStateCode = (req, res, next) => {
    const stateParam = req.params.state;
  
    if (!stateParam) {
      return res.status(400).json({ 'message': 'State abbreviation parameter is required' });
    }
  
    const normalizedCode = stateParam.toUpperCase();
  
    if (!stateCodes.includes(normalizedCode)) {
      return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
  
    // Attach normalized code for controller use
    req.stateCode = normalizedCode;
  
    next();
  };

module.export = verifyStateCode;