define([], function (){
	var config = {
		urls:{
			namsResData:'/namsResData',
			authorsTypeahead:'/author/%QUERY',
			analystsTypeahead: '/analyst/%QUERY'
		}	
	};
	return(config);
});