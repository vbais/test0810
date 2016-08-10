define(['radio', 'namsConstants', 'namsConfig'], function (Radio, NamsConstants, NamsConfig) {

    var NamsChannel = Radio.channel('NamsChannel');
    NamsChannel.set = function (prop, value) {
        NamsChannel[prop] = value;
    }
    NamsChannel.get = function (prop) {
        return (NamsChannel[prop]);
    }

    NamsChannel.lazyLoad = function (reqId) {
        var NamsResData = Backbone.Model.extend({
            url: function () {
                //var reqId = NamsChannel.get('reqId');
                return (reqId ? NamsConfig.urls.namsResData + '/' + reqId : NamsConfig.urls.namsResData);
            }
        });
        NamsChannel.namsResData = new NamsResData();
        NamsChannel.namsResData.fetch({
            success: function () {
                NamsChannel.trigger('staticData:populated',
                    function () {
                        var frsDatasets = [{}];
                        if (NamsChannel.namsResData.get('reqData')) {
                            frsDatasets = NamsChannel.namsResData.get('reqData').frsDatasets;
                        }
                        if ((!frsDatasets) || (frsDatasets.length === 0)) {
                            frsDatasets = [{}];
                        }
                        return (frsDatasets);
                    }
                );

                NamsChannel.trigger('staticData:dropDown:options',
                    NamsChannel.namsResData.get('staticData').dropDownOptions);

                NamsChannel.trigger('frsCoAuthors:populated', function () {
                    var coAuthors = [];
                    var reqData = NamsChannel.namsResData.get('reqData');
                    if (reqData) {
                        NamsChannel.set('reqId', reqData.id);
                        coAuthors = reqData.frsCoAuthors;
                    }
                    return (coAuthors);
                });

                NamsChannel.trigger('frsAnalysts:populated', function () {
                    var analysts = [];
                    var reqData = NamsChannel.namsResData.get('reqData');
                    if (reqData) {
                        analysts = reqData.frsAnalysts;
                    }
                    return (analysts);
                });

                NamsChannel.trigger('nonFrsCoAuthors:populated', function () {
                    var nfCoAuthors = [{}];
                    var reqData = NamsChannel.namsResData.get('reqData');
                    if (reqData) {
                        nfCoAuthors = reqData.nonFrsCoAuthors;
                    }
                    return (nfCoAuthors);
                })
            }
        });
    };

    NamsChannel.reply('y14ResearchTypes:get', function () {
        var y14ResearchTypes = null;
        if (NamsChannel.namsResData.get('staticData')) {
            y14ResearchTypes = NamsChannel.namsResData.get('staticData').y14ResearchTypes;
        }
        return (y14ResearchTypes);
    });

    NamsChannel.reply('y14Schedules:get', function () {
        var y14Schedules = null;
        if (NamsChannel.namsResData.get('staticData')) {
            y14Schedules = NamsChannel.namsResData.get('staticData').y14Schedules;
        }
        return (y14Schedules);
    });

    NamsChannel.reply('datasetObject:selected:get', function (id) {
        var ddOptions = NamsChannel.namsResData.get('staticData').dropDownOptions;
        var ddOption = _.find(ddOptions, function (item) {
            return (item.id == (id / 1)); // id/1 returns integer
        });
        return (ddOption);
    });

    NamsChannel.reply('frsDataset:dropdownOptions:get', function () {
        var ddOptions = NamsChannel.namsResData.get('staticData').dropDownOptions;
        return (ddOptions);
    });

    return (NamsChannel);
});
