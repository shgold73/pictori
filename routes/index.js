var express = require('express');
var router  = express.Router();

router.get('/', function(request, response, next) {
	response.render('index/index'});
});


module.exports = router;
