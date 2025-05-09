const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStateCode = require('../../middleware/verifyStates');

//CHANGECHANGECHANGECHANGECHANGECHANGECHANGE
router.route('/')
    .get(statesController.getAllStates)
    .put(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

router.route('/:state/funfact')
    .post(statesController.createNewFunFact)
    .get(statesController.getFunFact)
    .patch(statesController.updateFunFact)
    .delete(statesController.deleteFunFact);

// router.route('/:state/funfact')
//     .get(statesController.getFunFact);

// router.route('/:state/funfact')
//     .delete(statesController.deleteFunFact);

router.route('/:state/capital')
    .get(statesController.getStateCapital);

router.route('/:state/nickname')
    .get(statesController.getStateNickname);

router.route('/:state/population')
    .get(statesController.getStatePopulation);

router.route('/:state/admission')
    .get(statesController.getStateAdmission);

// router.route('/:state/funfact')
//     .patch(statesController.updateFunFact);

    //Currently verifystatecode is not working 
router.route('/:state')
    .get(statesController.getState);

module.exports = router;