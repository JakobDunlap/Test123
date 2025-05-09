const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStateCode = require('../../middleware/verifyStates');
const testCode = require('../../middleware/test')

router.route('/', verifyStateCode)
    .get(statesController.getAllStates)
    .put(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

router.route('/:state', verifyStateCode)
    .get(statesController.getState);

router.route('/:state/funfact', verifyStateCode)
    .post(statesController.createNewFunFact)
    .get(statesController.getFunFact)
    .patch(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

router.route('/:state/capital', testCode)
    .get(statesController.getStateCapital);

router.route('/:state/nickname', verifyStateCode)
    .get(statesController.getStateNickname);

router.route('/:state/population', verifyStateCode)
    .get(statesController.getStatePopulation);

router.route('/:state/admission', verifyStateCode)
    .get(statesController.getStateAdmission);

module.exports = router;