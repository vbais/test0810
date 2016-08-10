define(['backbone', 'marionette', 'Handlebars', 'backgrid', 'bootstrap', 'typeahead',
	'namsConstants', 'radio', 'namsChannel', 'backgrid-select-all'], function (Backbone, Marionette, Handlebars,
		Backgrid, bootstrap, t, NamsConstants, Radio, NamsChannel, Extension) {
		var NamsGrid = {};
		NamsGrid.namsChannel = Radio.channel('namsChannel');

		var guId = function guId() {
			function _p8(s) {
				var p = (Math.random().toString(16) + "000000000").substr(2, 8);
				return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
			}
			return _p8() + _p8(true) + _p8(true) + _p8();
		};

		NamsGrid.NamsModal = Backbone.View.extend({
			initialize: function (options) {
				this.options = options;
			},
			el: '#namsModalStub',
			template: Handlebars.compile(
				`
				<div id="namsModal" class="modal fade" role="dialog">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" id='namsModalClose' class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title">{{modalHeader}}</h4>
							</div>
							<div class="modal-body">
								<div id="namsModalChild"></div>
							</div>
							<div class="modal-footer">
								<button type="button" id='namsModalSubmit' class="btn btn-default" data-dismiss="modal">Submit</button>
								<button type="button" id='namsModalCancel' class="btn btn-default" data-dismiss="modal">Cancel</button>
							</div>
						</div>
					</div>
				</div>
				`
			),
			render: function () {
				this.$el.html(this.template({ modalHeader: this.options.modalHeader }));
				this.childView = this.options.childView;
				this.childView.setElement(this.$el.find('#namsModalChild'));
				this.childView.render();
				this.childView.delegateEvents();
				return (this);
			},
			events: {
				'click #namsModalSubmit': function (e) {
					NamsChannel.request('submit:clicked:command');
					this.undelegateEvents();
				},
				'click #namsModalCancel': function () {
					NamsChannel.request('cancel:clicked:command');
					this.undelegateEvents();
				},
				'click #namsModalClose': function () {
					NamsChannel.request('cancel:clicked:command');
					this.undelegateEvents();
				}
			}
		});

		//rows
		NamsGrid.SelectableRow = Backgrid.Row.extend({
			initialize: function (options) {
				NamsGrid.SelectableRow.__super__.initialize.apply(this, arguments);
				this.listenTo(this.model, "backgrid:selected", function (model, checked) {
					if (checked) {
						this.$el.addClass("selected");
						if (model.collection.selectedCount) {
							model.collection.selectedCount++;
						} else {
							model.collection.selectedCount = 1;
						}
						NamsChannel.request('selected:count', model.collection.selectedCount);
					}
					else {
						this.$el.removeClass("selected");
						if (model.collection.selectedCount) {
							model.collection.selectedCount--;
						}
						NamsChannel.request('selected:count', model.collection.selectedCount);
					}
				});
			}
		});

		//Cells
		NamsGrid.SelectCell = Backgrid.Extension.SelectRowCell.extend({
			initialize: function (options) {
				NamsGrid.SelectCell.__super__.initialize.apply(this, arguments);
				_.extend(this.events, Backgrid.Extension.SelectRowCell.prototype.events);
			},
			events: {
				'click [type="checkbox"]': 'clicked'
			}
		});

		NamsGrid.DeleteCell = Backgrid.Cell.extend({
			//template: _.template('<button>Delete</button>'),
			template: function () {
				var template = `<i class="glyphicon glyphicon-minus-sign"></i>`;
				return (template);
			},
			events: {
				"click i": "deleteRow"
			},
			deleteRow: function (e) {
				e.preventDefault();
				var coll = this.model.collection;

				if (this.beforeDelete) { //for DTCC column delete functionality
					this.beforeDelete(coll); //available from child stored in prototype
				}
				this.model.destroy();
			},
			render: function () {
				this.$el.html(this.template());
				this.delegateEvents();
				return this;
			}
		});

		NamsGrid.EditCell = Backgrid.StringCell.extend({
			render: function () {
				NamsGrid.EditCell.__super__.render.apply(this);
				this.$el.empty();
				this.currentEditor = new this.editor({
					column: this.column,
					model: this.model,
					formatter: this.formatter
				});
				this.model.trigger("backgrid:edit", this.model, this.column, this, this.currentEditor);
				this.$el.append(this.currentEditor.$el);
				this.currentEditor.render();
				this.$el.addClass("editor");
				this.delegateEvents();
				return this;
			}
		});

		NamsGrid.HtmlCell = Backgrid.HtmlCell = Backgrid.Cell.extend({
			className: "html-cell",
			initialize: function () {
				Backgrid.Cell.prototype.initialize.apply(this, arguments);
			},
			render: function () {
				this.$el.empty();
				var rawValue = this.model.get(this.column.get("name"));
				var formattedValue = this.formatter.fromRaw(rawValue, this.model);
				this.$el.append(formattedValue);
				this.delegateEvents();
				return this;
			}
		});

		NamsGrid.TermsOfUseFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
			fromRaw: function (rawValue, model) {
				var result = undefined;
				if (rawValue === true) {
					result = '<b>Agreed to T.O.U</b>';
				} else {
					result = '<b>Not Agreed to T.O.U</b>';
				}
				return result;
			}
		});

		NamsGrid.EligibilityFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
			fromRaw: function (rawValue, model) {
				var result = undefined;
				if (rawValue === true) {
					result = '<b>Eligible</b>';
				} else if (rawValue === false) {
					result = '<b>Ineligible</b>';
				} else {
					result = '<b>Pending Verification</b>'
				}
				return result;
			}
		});

		NamsGrid.DTCCFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
			fromRaw: function (rawValue, model) {
				var result = undefined;
				if (rawValue === true) {
					result = '<b>Agreed to DTCC Data Policy</b>';
				} else {
					result = '<b>Not Agreed to DTCC Data Policy</b>'
				}
				return result;
			}
		});
		//Footers
		NamsGrid.ADSearchFooter = Backgrid.Footer.extend({
			initialize: function (options) {
				this.options = options;

				var addLabel = 'Add';
				if (this.options.addLabel) {
					addLabel = this.options.addLabel;
				}
				this.addLabel = addLabel;

				options.guId = guId();
				this.collection.bind('add remove reset',
					this.setRowCount
					, this);
				//this.setADSearch(options);
			},
			setADSearch: function (options) {
				var result = new Bloodhound({
					datumTokenizer:
					function (d) {
						return Bloodhound.tokenizers.whitespace(d[options.adSearchConfig.searchFieldName]);
					},
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					remote: {
						url: options.adSearchConfig.url
					}
				});
				result.initialize();

				//setTimeout(function(){
				//_.defer(
				//	function () {
				var frsTypeAhead = $('#' + options.guId + ' .typeahead').typeahead({
					hint: true,
					highlight: true,
					minLength: 1
				},
					{
						name: 'ds1',
						display: 'name',
						source: result.ttAdapter()
					});
				frsTypeAhead.bind('typeahead:selected', function (ev, suggestion) {
					options.selectedObject = suggestion;
				});
				//});
				//}, 0);

			},
			template: _.template(`
			<tr>
				<td colspan="500">
					<div id="<%= NamsGridSearch %>" style="float:left">
						<input class="typeahead" type="text" placeholder="Search by User ID or First Name Last Name">
					</div>
					<button><%= label %></button>
					<span style="float:right">Total:<%= this.collection.length %></span>
				</td>
			</tr>`),
			events: {
				'click button': "addRow"
			},
			render: function () {
				this.$el.html(this.template({ NamsGridSearch: this.options.guId, label: this.addLabel }));
				this.delegateEvents();
				var it = this;
				_.defer(function () {
					it.setADSearch(it.options);
				});
				return this;
			},
			setRowCount: function () {
				// var addLabel = 'Add';
				// if (this.options.addLabel) {
				// 	addLabel = this.options.addLabel;
				// }
				// this.addLabel = addLabel;
				this.$el.html(this.template({ NamsGridSearch: this.options.guId, label: this.addLabel }));
				//this.setADSearch(this.options);					
			},
			addRow: function (e) {
				if (this.options.selectedObject) {
					var myModel = new this.collection.model();
					var outputFieldNames = this.options.adSearchConfig.outputFieldNames;
					for (i = 0; i < outputFieldNames.length; i++) {
						myModel.set(outputFieldNames[i], this.options.selectedObject[outputFieldNames[i]]);
					}
					var loginName = this.options.selectedObject.loginName;
					var isLoginNameExists = this.collection.findWhere({ loginName: loginName });
					if (!isLoginNameExists) {
						this.collection.add(myModel);
						this.options.selectedObject = undefined;
						var it = this;
						_.defer(function () { it.setADSearch(it.options); });
					}


				}
				// var it = this;
				// _.defer(function () { it.setADSearch(it.options); });
			}
		});

		NamsGrid.AddRowFooter = Backgrid.Footer.extend({
			template: _.template(`
				<tr>
					<td colspan="500">
						<button><%= label %></button>
						<span style='float:right'>Total:<%= this.collection.length %></span>
					</td>
				</tr>				
			`),
			events: {
				'click button': "addRow"
			},
			initialize: function (options) {
				var addLabel = 'Add';
				if (options.addLabel) {
					addLabel = options.addLabel;
				}
				this.collection.bind(
					'add remove reset',
					function () {
						this.$el.html(this.template({ label: addLabel }));
					}, this);
			},
			addRow: function (event) {
				event.preventDefault();
				var myModel = new this.collection.model();
				this.collection.add(myModel);
			}
		});

		NamsGrid.SelectCountFooter = Backgrid.Footer.extend({
			template: Handlebars.compile(
				`
					<span>Total Selected: <\span>
					<span>{{selectedCount}}</span>
				`
			),
			self: undefined,
			initialize: function () {
				this.$el.html(this.template({ selectedCount: 0 }));
				it = this;
			},
			render: function () {
				NamsChannel.reply('selected:count', function (selectedCount) {
					it.$el.html(it.template({ selectedCount: selectedCount }));
				});
				this.$el.html(this.template({ selectedCount: 0 }));
				return (this);
			}
		});
		//Grids
		NamsGrid.Grid = Backgrid.Grid.extend({
		});

		var frsDtccColumn =
			{
				name: "dtccDataPolicy",
				label: "DTCC Data Policy",
				editable: "false",
				//headerCell: DTCCDataPolicyHeader,
				cell: "html",
				formatter: NamsGrid.DTCCFormatter
			};

		NamsGrid.FrsGrid = Backgrid.Grid.extend({
			initialize: function (options) {
				NamsGrid.FrsGrid.__super__.initialize.apply(this, arguments);
				var self = this;
				NamsChannel.on('dtcc:remove', function () {
					if (self.isDtccColumnAdded) {
						self.columns.at(self.columns.length - 2).destroy();   //remove({ at: frsCoAuthorsGrid.columns.length - 1 });
						self.isDtccColumnAdded = false;
					}
				});

				NamsChannel.on('dtcc:add', function () {
					if (!self.isDtccColumnAdded) {
						self.columns.add(frsDtccColumn, { at: self.columns.length - 1 });
						self.isDtccColumnAdded = true;
					}
				});
			}
		});
		return (NamsGrid);
	});

/*
SSS:
1. Delete icon is implemented as font. You need to paste glyphicons-halflings-regular.zip file unzipped in fonts folder
*/

// Useful code
/*
			this.$el.find('button').hide();
			
			 ,render: function () {
			 	Backgrid.Row.prototype.render.call(this)
			 	// if (this.model.get('value1') <= 5 && this.model.get('value2') >= 5) {
			 	// 	this.$el.addClass('red')
			 	// } else {
			 	// 	this.$el.removeClass('red')
			 	// }
			 	return this
			 }
			 // NamsGrid.CheckboxHeader = Backgrid.HeaderCell.extend({
		// 	template:function(){
		// 		var template = '<input type="checkbox">'
		// 		return(template);
		// 	},
		// 	render:function(){
		// 		this.$el.html(this.template());
		// 		this.delegateEvents();
		// 		return this;
		// 	}
		// });
//for html5 custom script
				// $('#myModal').on('shown.bs.modal', function () {
				// 	$('#myInput').focus()
				// });

				//NamsGrid.vent = _.extend({}, Backbone.Events); //Event aggregator

		// NamsGrid.namsChannel.reply('testRequest', function (d) {
		// 	return (d.info + ' This is established');
		// });
		// var data = NamsGrid.namsChannel.request('testRequest',
		// 	{ info: 'Using of radio is trivial in Backbone.' });
		// console.log(data);
*/