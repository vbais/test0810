define(['radio', 'namsConstants', 'namsConfig'], function (Radio, NamsConstants, NamsConfig) {

    var NamsChannel = Radio.channel('NamsChannel');
    NamsChannel.set = function (prop, value) {
        NamsChannel[prop] = value;
    }
    NamsChannel.get = function (prop) {
        return (NamsChannel[prop]);
    }

    NamsChannel.lazyLoad = function (reqId,callback) {
        var NamsResData = Backbone.Model.extend({
            url: function () {
                return (reqId ? NamsConfig.urls.namsResData + '/' + reqId : NamsConfig.urls.namsResData);
            }
        });
        NamsChannel.namsResData = new NamsResData();
        NamsChannel.namsResData.fetch({
            success: function () {
                NamsChannel.trigger('lazyLoad:success', NamsChannel.namsResData);

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
                callback();
            }
        });
    };
    NamsChannel.reply('datasetDDOptions:get', function () {
        var v = {
            id: 0,
            displayText: '--Select--'
        };
        var dropDownOptions = NamsChannel.namsResData.get('staticData').dropDownOptions;
        return ([v].concat(dropDownOptions));
    });
    NamsChannel.reply('y14ResearchTypes:get:displayText', function (id) {
        var allY14ResearchTypes = NamsChannel.namsResData.get('staticData').y14ResearchTypes;
        y14ResearchTypes = _.findWhere(allY14ResearchTypes, { id: id });
        return (y14ResearchTypes.displayText);
    })
    NamsChannel.reply('y14ResearchTypes:get', function () {
        var y14ResearchTypes = null;
        if (NamsChannel.namsResData.get('staticData')) {
            y14ResearchTypes = NamsChannel.namsResData.get('staticData').y14ResearchTypes;
        }
        return (y14ResearchTypes);
    });

    NamsChannel.reply('y14Schedule:get:scheduleObject', function (id) {
        var allY14Schedules = NamsChannel.namsResData.get('staticData').y14Schedules;
        y14Schedule = _.findWhere(allY14Schedules, { id: id });
        return (y14Schedule);
    });

    NamsChannel.reply('y14Schedules:get', function () {
        var y14Schedules = null;
        if (NamsChannel.namsResData.get('staticData')) {
            y14Schedules = NamsChannel.namsResData.get('staticData').y14Schedules;
        }
        return (y14Schedules);
    });

    NamsChannel.reply('datasetObject:selected:get', function (id) {
        var ddOption = null;
        var staticData = NamsChannel.namsResData.get('staticData');
        if (staticData) {
            var ddOptions = staticData.dropDownOptions;
            ddOption = _.find(ddOptions, function (item) {
                return (item.id == (id / 1)); // id/1 returns integer
            });
        }

        return (ddOption);
    });

    NamsChannel.reply('dataset:dropdownOptions:get', function () {
        var ddOptions = NamsChannel.namsResData.get('staticData').dropDownOptions;
        return (ddOptions);
    });

    return (NamsChannel);
});
