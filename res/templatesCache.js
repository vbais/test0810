define(['Handlebars', 'namsGrid'], function (Handlebars, NamsGrid) {
	var templateHash = {};

	templateHash.namsResTemplate = `
			<button class='namsResViewSubmit'>Submit</button>
			<button class='namsResViewSaveForLater'>Save for later</button>
			<div id='simpleViewTest'></div>
	        <h2>This is namsResTemplate</h2>
	    	<div id = 'namsModalStub'></div>
	    	<div id = 'resHeader'></div>
	    	<div id = 'resRequestersEndorsers'></div>
	    	<div id = 'resProjectInfo'></div>    
	    	<div id = 'resRequestedDataStorage'></div>
			<div id = 'resRequestedDataStorage1'></div>
	    	<div id = 'resCoAuthorsSupportStaff'></div>
	`;

    templateHash.resHeaderTemplate = `
	        <h3>Header section</h3>
    `;

    templateHash.resRequestersEndorsersTemplate = `
	        <h3>Requesters and Endorsers section</h3>
    `;

    templateHash.resProjectInfoTemplate = `
	        <h1>1. Project Information</h1>
    		<div>Project Information</div> 
    `;

    templateHash.resRequestedDataStorageTemplate = `
    		<h1>2. Requested Data and Storage</h1>
    		<div>Requested Data and Storage</div>
    		<div>data Sets</div>
    		<div id="frsDatasets">Loading...</div>
    `;

    templateHash.resCoAuthorsSupportStaffTemplate = `
    		<h1>3. Co-Authors and Support Staff</h1>
		    <div>Co-Authors and Support Staff</div>
			<div>List every individual who will be working with the requested data</div>
		    
		    <div>FRS Co-Author(s) or Research Assistant(s)</div>
		    <div id="frsCoAuthors">Loading...</div>
		      
		    <div>FRS Analyst(s) or Support Staff</div>
		    <div id="frsAnalysts">Loading...</div>

		    <div>Non-FRS Co-Author</div>   
		    <div id="nonFrsCoAuthors">Loading...</div>
	`;

	var cache = {};
	cache.get = function (templateName) {				
		return (Handlebars.compile(templateHash[templateName]));
	}
	return (cache);
});

/*
// templateHash.namsResTemplate =
	// function(){
	// 	return(`
	// 		<button class='namsResViewSubmit'>Submit</button>
	// 		<div id='simpleViewTest'></div>
	//         <h2>This is namsResTemplate</h2>
	//     	<div id = 'namsModalStub'></div>
	//     	<div id = 'resHeader'></div>
	//     	<div id = 'resRequestersEndorsers'></div>
	//     	<div id = 'resProjectInfo'></div>    
	//     	<div id = 'resRequestedDataStorage'></div>
	//     	<div id = 'resCoAuthorsSupportStaff'></div>			
    // 	`);
	// };

	templateHash.resHeaderTemplate =
    function(){
    	return(`
	        <h3>Header section</h3>
    	`);
    }

	templateHash.resRequestersEndorsersTemplate =
    function(){
    	return(`
	        <h3>Requesters and Endorsers section</h3>
    	`);
    };
	templateHash.resProjectInfoTemplate =
	function(){
		return(`
	        <h1>1. Project Information</h1>
    		<div>Project Information</div> 
    	`);
	};
	templateHash.resRequestedDataStorageTemplate =
    function(){
    return(
    	`
    		<h1>2. Requested Data and Storage</h1>
    		<div>Requested Data and Storage</div>
    		<div>data Sets</div>
    		<div id="frsDatasets">Loading...</div>
    	`
    	);
    };

	templateHash.resCoAuthorsSupportStaffTemplate =
    function(){
    return(
    	`
    		<h1>3. Co-Authors and Support Staff</h1>
		    <div>Co-Authors and Support Staff</div>
			<div>List every individual who will be working with the requested data</div>
		    
		    <div>FRS Co-Author(s) or Research Assistant(s)</div>
		    <div id="frsCoAuthors">Loading...</div>
		      
		    <div>FRS Analyst(s) or Support Staff</div>
		    <div id="frsAnalysts">Loading...</div>

		    <div>Non-FRS Co-Author</div>   
		    <div id="nonFrsCoAuthors">Loading...</div>
    	`
    	);
    };
*/