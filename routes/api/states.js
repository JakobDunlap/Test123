const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStateCode = require('../../middleware/verifyStates');

//dunno if this works, also might need to use getAllFunFacts
router.route('/')
    .get(statesController.getAllStates)
    .post(statesController.createNewFunFact)
    .put(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

    //Currently verifystatecode is not working 
router.route('/:state')
    .get(statesController.getState);

module.exports = router;