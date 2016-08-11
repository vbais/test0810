define(['backbone', 'marionette', 'Handlebars', 'backgrid', 'bootstrap', 'typeahead',
	'namsConstants', 'namsChannel', 'namsGrid', 'app', 'templatesCache', 'namsConfig'], function (Backbone, Marionette, Handlebars,
		Backgrid, bootstrap, t, NamsConstants, NamsChannel, NamsGrid, App, TemplatesCache, NamsConfig) {

		/*
		lazyLoad loads static data in NamsChannel. Router sets reqId property of NamsChannel.
		If reqId is null then only static data is downloaded from server.
		If reqId is not null static data + data corresponding to reqId is downloaded from server
		*/


		var NamsResModel = Backbone.Model.extend({});

		var namsResModel = new NamsResModel();

		var NamsResView = Marionette.LayoutView.extend({
			template: TemplatesCache.get('namsResTemplate'),
			regions: {
				rgResHeader: '#resHeader',
				rgResRequestersEndorsers: '#resRequestersEndorsers',
				rgResProjectInfo: '#resProjectInfo',
				rgResRequestedDataStorage: '#resRequestedDataStorage',
				rgResRequestedDataStorage1: '#resRequestedDataStorage1',
				rgResCoAuthorsSupportStaff: '#resCoAuthorsSupportStaff'
			},
			onRender: function () {
				this.rgResHeader.show(new ResHeaderView());
				this.rgResRequestersEndorsers.show(new ResRequestersEndorsersView());
				this.rgResProjectInfo.show(new ResProjectInfoView());
				this.rgResRequestedDataStorage.show(new ResRequestedDataStorageView());
				//this.rgResRequestedDataStorage1.show(new ResRequestedDataStorageView1());
				this.rgResCoAuthorsSupportStaff.show(new ResCoAuthorsSupportStaffView());
			},
			el: '#appCommonHeaderRegion',
			events: {
				'click .namsResViewSubmit': function () {
					NamsChannel.trigger('namsResView:submit:click', namsResModel);

					namsResModel.save({ id: null, isDraft: false }, {
						url: NamsConfig.urls.namsResData,
						success: function (model) {
							console.log('data saved');
						},
						error: function (model) {
							console.log('error');
						}
					});
				},
				'click .namsResViewSaveForLater': function () {
					NamsChannel.trigger('namsResView:submit:click', namsResModel);
					namsResModel.save({ id: NamsChannel.get('reqId'), isDraft: true }, {
						url: NamsConfig.urls.namsResData,
						success: function (model) {
							console.log('data saved');
						},
						error: function (model) {
							console.log('error');
						}
					});
				}
			}
		});

		// NamsResView.lazyLoad = function () {
		// 	NamsChannel.lazyLoad();
		// }

		var ResHeaderView = Marionette.LayoutView.extend({
			template: TemplatesCache.get('resHeaderTemplate'),
			render: function () {
				this.$el.html(this.template());
				// this.childView = new SimpleViewTest({ model: simpleViewModel });
				// this.childView.render();
				// NamsChannel.trigger('testEvent:fired', 'Event Data');
				return (this);
			}

		});

		var ResRequestersEndorsersView = Marionette.LayoutView.extend({
			template: TemplatesCache.get('resRequestersEndorsersTemplate'),
			render: function () {
				this.$el.html(this.template());
				// simpleViewModel.set('display', 'replaced text 2');
				return (this);
			}
		});

		var ResProjectInfoView = Marionette.LayoutView.extend({
			template: TemplatesCache.get('resProjectInfoTemplate')
		});

		//-------------------------------------------------------------------------
		//Requested Data and Storage		

		//Model
		var FrsDatasets = Backbone.Collection.extend({});
		var frsDatasets = new FrsDatasets();
		var frsDDOptions = {
			id: 0,
			displayText: '--Select--'
		};;
		NamsChannel.on('lazyLoad:success', function (namsResData) {
			var reqData = namsResData.get('reqData');
			var lzDatasets = reqData ? reqData.frsDatasets : [{}];
			frsDatasets.reset(lzDatasets);
			frsDDOptions = namsResData.get('staticData').dropDownOptions;
		});

		var FrsDatasetDropDownCell = Backgrid.Cell.extend({
			//id:'',
			initialize: function () {
				FrsDatasetDropDownCell.__super__.initialize.apply(this, arguments);
				this.column.currentModel = this.model;
				this.column.datasetType = ''; //dtcc or y14 or else
				//this.model.set('datasetId', 0, { silent: true }); //silent:true disables rerender when model changes.
				var it = this;
				this.column.set('dropDownOptions', NamsChannel.request('datasetDDOptions:get'));
				NamsChannel.reply('cancel:clicked:command', function () {
					it.column.currentModel.destroy();
					if (it.column.datasetType === 'dtcc') {
						NamsChannel.trigger('dtcc:remove'); //NamsGrid.FrsGrid
					} else if (it.column.datasetType === 'y14') {
						y14SchedulesGrid.clearSelectedModels();
					}
				});
				NamsChannel.reply('submit:clicked:command', function () {
					if (it.column.datasetType === 'dtcc') {
						console.log('dtcc submitted');
					} else if (it.column.datasetType === 'y14') {
						var selectedModels = y14SchedulesGrid.getSelectedModels();
						var schedules = _.map(selectedModels, function (selectedModel) {
							return (selectedModel.get('schedule') + ' - ' + selectedModel.get('description'));
						}).join('</br>');
						it.column.currentModel.set('y14Schedules', schedules);
						var selectedResearchType = NamsChannel.request('selectedResearchType:get');
						var schedulesIdArray = _.map(selectedModels, function (selectedModel) {
							return ({
								id: selectedModel.id
							});
						});
						if (selectedResearchType && schedulesIdArray.length > 0) {
							it.column.currentModel.set('y14ResearchTypes', selectedResearchType.displayText);
							var y14Data = {
								y14ResearchTypes: { id: selectedResearchType ? selectedResearchType.id : 0 },
								y14Schedules: schedulesIdArray
							};
							it.column.currentModel.set('y14Data', y14Data);
						}
						_.defer(function () {
							y14SchedulesGrid.clearSelectedModels();
						});
					}
				});
			},
			render: function () {
				var guId = NamsGrid.guId();
				var it = this;
				this.$el.html(this.template(
					{
						data: this.column.get('dropDownOptions'),
						id: guId
					}));
				var datasetId = this.model.get('datasetId') || 0;
				$('#' + guId).val(datasetId);

				_.defer(function () {
					$('#' + guId).val(datasetId);
				});

				//populate other columns of grid
				if (datasetId) {
					var selectedObject = NamsChannel.request('datasetObject:selected:get', datasetId);
					if (datasetId / 1 != 0) {
						this.model.set('owners', selectedObject.owners.join('</br>'));
						this.model.set('classification', selectedObject.classification);
						if (selectedObject.displayText === NamsConstants.y14) {
							var y14ResearchTypesId = this.model.get('y14Data').y14ResearchTypes.id;
							var y14ResearchTypesDisplayText = NamsChannel.request('y14ResearchTypes:get:displayText', y14ResearchTypesId);
							this.model.set('y14ResearchTypes', y14ResearchTypesDisplayText);
							var y14SchedulesArray = this.model.get('y14Data').y14Schedules;
							var y14Schedules = _.map(y14SchedulesArray, function (y14Schedule) {
								var y14ScheduleObject = NamsChannel.request('y14Schedule:get:scheduleObject', y14Schedule.id);
								//return (scheduleObject.get('schedule') + ' - ' + selectedModel.get('description'));
							}).join('</br>');
						}
					}
				}
				this.delegateEvents();
				return this;
			},
			isDtccExist: function () {
				var dtccId = 0;
				var ret = false;
				var dtcc = this.column.get('dropDownOptions').find(function (d) {
					return (d.displayText === NamsConstants.dtccSwap)
				});
				if (dtcc) {
					dtccId = dtcc.id;
				} else {
					console.log('Dtcc swap spelling mismatch');
					//return;
				}
				//find out if any row in dataset has dtcc swap selected from drop downlist				
				var isExist = this.model.collection.find(function (d) {
					return (d.get('datasetId') / 1 === dtccId);
				});
				if (isExist && (dtccId > 0)) {
					ret = true;
				}
				return (ret);
			},
			events: {
				change: function (e) {
					var selectedValue = $(e.target).val();
					var selectedText = $(e.target).find('option:selected').text().trim();

					//prevent rows having same datasetId (duplicate rows)					
					
					var isExists = this.model.collection.any(function(item){
							return(item.get('datasetId')/1 === selectedValue/1); //to convert to integer
					});					
					if (isExists) {
						this.model.destroy();
						return;
					}
					var columnName = this.column.get('name');
					this.model.set(columnName, selectedValue, { silent: true }); //silent:true disables rerender when model changes.										

					this.model.set('owners', null);
					this.model.set('classification', null);
					this.model.set('y14ResearchTypes', null);
					this.model.set('y14Schedules', null);
					this.model.set('y14Data', null);
					this.column.currentModel = this.model;
					//NamsChannel.trigger('dtcc:remove');//NamsGrid.FrsGrid

					var selectedObject = NamsChannel.request('datasetObject:selected:get', selectedValue);
					if (selectedValue / 1 != 0) {
						this.model.set('owners', selectedObject.owners.join('</br>'));
						this.model.set('classification', selectedObject.classification);
					}
					if (selectedText === NamsConstants.dtccSwap) {
						this.column.datasetType = 'dtcc';
						NamsChannel.trigger('dtcc:add');//NamsGrid.FrsGrid						
						var namsModal = new NamsGrid.NamsModal({
							childView: new DtccDataPolicyChildView()
						});
						namsModal.render();
						$('#namsModal').modal();
					} else if (selectedText === NamsConstants.y14) {
						//if dtcc swap does not exist in any of the rows then only remove 'DTCC data policy' column from other grids.
						if (!this.isDtccExist()) {
							NamsChannel.trigger('dtcc:remove');
						}
						this.column.datasetType = 'y14';
						var namsModal = new NamsGrid.NamsModal({
							childView: new Y14ChildView(),
							modalHeader: NamsConstants.y14ModalCaption
						});
						namsModal.render();
						$('#namsModal').modal();
						NamsChannel.trigger('y14Modal:fired'); // to load schedules
					} else if (selectedText === NamsConstants.fdicSummary) {
						//if dtcc swap does not exist in any of the rows then only remove 'DTCC data policy' column from other grids.
						if (!this.isDtccExist()) {
							NamsChannel.trigger('dtcc:remove');
						}
						console.log('fdic summary');
					}
				}
			},
			template: Handlebars.compile(`
				<select name='frsDatasetOptions' id='{{id}}'>
					{{#each data}}
						<option value='{{this.id}}'>{{this.displayText}} </option> 
					{{/each}}
				</select>				
			`)
		});

		var FrsDatasetDeleteCell = NamsGrid.DeleteCell.extend({
			beforeDelete: function (coll) {
				var dtccId = 0;
				var ddOptions = NamsChannel.request('dataset:dropdownOptions:get');
				var dtcc = _.findWhere(ddOptions, { displayText: NamsConstants.dtccSwap });
				if (dtcc) {
					dtccId = dtcc.id;
				} else {
					return;
				}
				if (this.model.get('datasetId') / 1 === dtccId) {
					NamsChannel.trigger('dtcc:remove');
				};
			}
		});

		var frsDatasetColumns =
			[{ name: "datasetId", label: "Data Set", cell: FrsDatasetDropDownCell },
				{ name: "owners", sortable: false, label: "Owners", editable: "false", cell: "html" },
				{ name: "classification", label: "Classification", editable: "false", cell: "html" },
				{ name: "y14ResearchTypes", label: "Y-14 Research Types", editable: "false", cell: "html" },
				{ name: "y14Schedules", label: "Y-14 Schedules", editable: "false", cell: "html" },
				{ name: "delete", label: "Delete", cell: FrsDatasetDeleteCell },
				{ name: "y14Data", label: "y14Data", editable: "false", cell: "string" }
				// ,{ name: "id", label: "Gender", cell: FrsDatasetOptions }
			];

		var ResRequestedDataStorageView = Marionette.LayoutView.extend({
			template: TemplatesCache.get('resRequestedDataStorageTemplate'),
			regions: {
				rgFrsDatasets: '#frsDatasets'
			},
			onRender: function () {
				frsDatasetsGrid = new NamsGrid.Grid({
					className: '',
					columns: frsDatasetColumns,
					collection: frsDatasets,
					footer: NamsGrid.AddRowFooter,
					addLabel: 'Add Data Set',
					emptyText: 'No Data'
				});
				this.rgFrsDatasets.show(frsDatasetsGrid);
			}
		});

		var DtccDataPolicyChildView = Backbone.View.extend(
			{
				template: Handlebars.compile(`
						<div>
							<div>{{dtccDataPolicy}}</div>
						</div>					
					`),
				render: function () {
					this.$el.html(this.template({ dtccDataPolicy: NamsConstants.dtccDataPolicy }));
				}
			}
		);

		var Y14ChildView = Backbone.View.extend({
			template: function () {
				var template =
					`				
					<div>Research Types</div>
					<div id='namsY14ResearchTypes'></div>
					<div>Schedules</div>
					<div id='namsY14SchedulesGrid'></div>
				`;
				return (template);
			},
			render: function () {
				this.$el.html(this.template());
				this.childView1 = new Y14ResearchTypes({});
				this.childView1.setElement(this.$el.find('#namsY14ResearchTypes'));
				this.childView1.render();
				this.childView1.delegateEvents();

				this.childView2 = y14SchedulesGrid;
				this.childView2.setElement(this.$el.find('#namsY14SchedulesGrid'));
				this.childView2.render();
				this.childView2.delegateEvents();
				return (this);
			}
		});

		var Y14ResearchTypes = Backbone.View.extend({
			template: Handlebars.compile(
				`					
					{{#each researchTypes}}
						<input type="radio" name="researchTypes" data-displayText='{{this.displayText}}' class="y14ResearchTypes" value="{{this.id}}">{{this.displayText}}<br>
					{{/each}}
				`
			),
			render: function () {
				var researchTypes = NamsChannel.request('y14ResearchTypes:get');
				this.$el.html(this.template({ researchTypes: researchTypes }));
			},
			events: {
				'change input[type=radio]': function (e) {
					e.stopPropagation();
					this.selectedResearchType = $(e.target).val();
					NamsChannel.reply('selectedResearchType:get', function () {
						var selectedResearchType = {
							id: $(e.target).val(),
							displayText: $(e.target).attr('data-displayText')
						};
						return (selectedResearchType);
					})
				}
			}
		});

		var Y14SchedulesColumns = [{ name: "", cell: NamsGrid.SelectCell, headerCell: "select-all" }, { name: "fry14", label: "FRY-14", editable: "false", cell: "string" }, { name: "schedule", label: "Schedule", editable: "false", cell: "string" }, { name: "description", label: "Description", editable: "false", cell: "string" }];

		var y14SchedulesCollection = new Backbone.Collection();
		NamsChannel.on('y14Modal:fired', function () {
			y14SchedulesCollection.add(NamsChannel.request('y14Schedules:get'));
		});

		var y14SchedulesGrid = new NamsGrid.Grid({
			className: '',
			row: NamsGrid.SelectableRow,
			columns: Y14SchedulesColumns,
			collection: y14SchedulesCollection,
			footer: NamsGrid.SelectCountFooter,
			emptyText: 'No Data'
		});

		//Co-Authors and support staff
		//-------------------------------------------------------------------------		

		var ResCoAuthorsSupportStaffView = Marionette.LayoutView.extend({
			template: TemplatesCache.get('resCoAuthorsSupportStaffTemplate'),
			regions: {
				rgFrsCoAuthors: '#frsCoAuthors',
				rgFrsAnalysts: '#frsAnalysts',
				rgNonFrsCoAuthors: '#nonFrsCoAuthors'
			},
			onRender: function () {
				nonFrsCoAuthorsGrid = new NamsGrid.Grid({
					className: '',
					columns: nonFrsCoAuthorColumns,
					collection: nonFrsCoAuthors,
					footer: NamsGrid.AddRowFooter,
					addLabel: NamsConstants.addNonFrsCoAuthor// 'Add Non-FRS Co-Author',			
				});
				this.rgFrsCoAuthors.show(frsCoAuthorsGrid);
				this.rgFrsAnalysts.show(frsAnalystsGrid);
				this.rgNonFrsCoAuthors.show(nonFrsCoAuthorsGrid);
			}
		});
		//Model

		var FrsCoAuthors = Backbone.Collection.extend({});
		var FrsAnalysts = Backbone.Collection.extend({});
		var NonFrsCoAuthors = Backbone.Collection.extend({});

		var frsCoAuthors = new FrsCoAuthors();
		var frsAnalysts = new FrsAnalysts();
		var nonFrsCoAuthors = new NonFrsCoAuthors();

		NamsChannel.on('namsResView:submit:click', function (namsResModel) {

			frsDatasets = _.map(frsDatasets.toJSON(), function (item) {
				return ({
					id: item.datasetId,
					y14Data: item.y14Data
				});
			});

			frsCoAuthors = _.map(frsCoAuthors.toJSON(), function (item) {
				return ({
					loginName: item.loginName
				});
			});

			frsAnalysts = _.map(frsAnalysts.toJSON(), function (item) {
				return ({
					loginName: item.loginName
				});
			});

			nonFrsCoAuthors = _.map(nonFrsCoAuthors.toJSON(), function (item) {
				return ({
					name: item.Name,
					affiliation: item.affiliation,
					email: item.email
				});
			});

			namsResModel.set('frsDatasets', frsDatasets);
			namsResModel.set('frsCoAuthors', frsCoAuthors);
			namsResModel.set('frsAnalysts', frsAnalysts);
			namsResModel.set('nonFrsCoAuthors', nonFrsCoAuthors);
		});

		var frsCoAuthorColumns =
			[{ name: "loginName", label: "Login Name", editable: "false", cell: "string" },
				{ name: "name", label: "Name", editable: "false", cell: "string" },
				{ name: "termsOfUse", sortable: false, label: "Terms of Use", editable: "false", cell: "html", formatter: NamsGrid.TermsOfUseFormatter },
				{ name: "csiEligibility", label: "CSI Eligibility", editable: "false", cell: "html", formatter: NamsGrid.EligibilityFormatter },
				{ name: "delete", label: "Delete", cell: NamsGrid.DeleteCell }
			];

		var frsAnalystColumns =
			[{ name: "loginName", label: "Login Name", editable: "false", cell: "string" },
				{ name: "name", label: "Name", editable: "false", cell: "string" },
				{ name: "termsOfUse", label: "Terms of Use", editable: "false", cell: "html", formatter: NamsGrid.TermsOfUseFormatter },
				{ name: "csiEligibility", label: "CSI Eligibility", editable: "false", cell: "html", formatter: NamsGrid.EligibilityFormatter },
				{ name: "delete", label: "Delete", cell: NamsGrid.DeleteCell }
			];

		var nonFrsCoAuthorColumns =
			[{ name: "name", label: "Name", cell: NamsGrid.EditCell },
				{ name: "affiliation", label: "Affiliation", cell: NamsGrid.EditCell },
				{ name: "email", label: "Email", cell: NamsGrid.EditCell },
				{ name: "delete", label: "Delete", cell: NamsGrid.DeleteCell }
			];

		NamsChannel.on('frsCoAuthors:populated', function (coAuthorsFunc) {
			var coAuthors = coAuthorsFunc();
			if (coAuthors) {
				frsCoAuthors.reset(coAuthors);
			}
		});

		NamsChannel.on('frsAnalysts:populated', function (analystsFunc) {
			var analysts = analystsFunc();
			if (analysts) {
				frsAnalysts.reset(analysts);
			}
		});

		NamsChannel.on('nonFrsCoAuthors:populated', function (nfCoAuthorsFunc) {
			var nfCoAuthors = nfCoAuthorsFunc();
			if (nfCoAuthors) {
				nonFrsCoAuthors.reset(nfCoAuthors);
			}
		});

		var frsCoAuthorsGrid = new NamsGrid.FrsGrid({
			className: '',
			columns: frsCoAuthorColumns,
			collection: frsCoAuthors,
			footer: NamsGrid.ADSearchFooter,
			emptyText: 'No Data',
			addLabel: NamsConstants.addFrsCoAuthors,
			adSearchConfig: {
				url: NamsConfig.urls.authorsTypeahead,//'/author/%QUERY',
				searchFieldName: 'name',
				outputFieldNames: ['loginName', 'name', 'termsOfUse', 'csiEligibility', 'dtccDataPolicy']
			}
		});

		var frsAnalystsGrid = new NamsGrid.FrsGrid({
			className: '',
			columns: frsAnalystColumns,
			collection: frsAnalysts,
			footer: NamsGrid.ADSearchFooter,
			emptyText: 'No Data',
			addLabel: NamsConstants.addFrsAnalysts,
			adSearchConfig: {
				url: NamsConfig.urls.analystsTypeahead,//'/analyst/%QUERY',
				searchFieldName: 'name',
				outputFieldNames: ['loginName', 'name', 'termsOfUse', 'csiEligibility', 'dtccDataPolicy']
			}
		});

		var nonFrsCoAuthorsGrid = new NamsGrid.Grid({
			className: '',
			columns: nonFrsCoAuthorColumns,
			collection: nonFrsCoAuthors,
			footer: NamsGrid.AddRowFooter,
			addLabel: NamsConstants.addNonFrsCoAuthor// 'Add Non-FRS Co-Author',			
		});

		//App.on('start', function (options) {
		//frsCoAuthors.fetch();
		//frsAnalysts.fetch();
		//nonFrsCoAuthors.fetch();
		//frsDatasets.fetch();
		//});

		return (NamsResView);
	});

/*
SSS:

*/

