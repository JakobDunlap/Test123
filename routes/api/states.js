const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStateCode = require('../../middleware/verifyStates');

router.route('/', verifyStateCode)
    .get(statesController.getAllStates)
    .put(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

router.route('/:state')
    .get(statesController.getState);

router.route('/:state/funfact')
    .post(statesController.createNewFunFact)
    .get(statesController.getFunFact)
    .patch(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

router.route('/:state/capital')
    .get(statesController.getStateCapital);

router.route('/:state/nickname')
    .get(statesController.getStateNickname);

router.route('/:state/population')
    .get(statesController.getStatePopulation);

router.route('/:state/admission')
    .get(statesController.getStateAdmission);

module.exports = router;