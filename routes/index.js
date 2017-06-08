var express = require('express');
var router  = express.Router();

router.get('/', function(request, response, next) {
	response.redirect('/imagepost');
});


module.exports = router;
