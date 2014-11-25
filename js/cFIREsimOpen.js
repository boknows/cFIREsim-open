(function getData (){
	var data = {
		param: "getAll",
	};

	$.ajax({
	    url: "getData.php",
	    data: data,
	    type: "POST",
	    dataType: 'JSON',
	    success: function(e) {
	        console.log(e);
	    },
	});
})();