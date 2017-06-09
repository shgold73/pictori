var express = require('express');
var router  = express.Router();

router.get('/', function(request, response, next) {

	if(request.user){
		response.redirect('/imagepost');
	}
	else{
		response.redirect('/user/log-in');
	}

});


module.exports = router;
