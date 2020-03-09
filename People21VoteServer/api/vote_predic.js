const compute = require('../component/counter');
var express = require('express');
var router = express.Router();

// predict_result
router.post('/predict_result', function (req, res) {
    var rows = req.body.obj;

    var result = compute.compute(rows);
    console.log(result);

    res.json(
        {
            success: true,
            rows : result
        }
    );
});

module.exports = router;