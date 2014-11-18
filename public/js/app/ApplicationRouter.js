define([
    'view/TestView',
    'model/TestModel',
    'command/OnTestModelChangedLogSomethingCommand',
    'util/isDebug'
], function(TestView,
            TestModel,
            OnTestModelChangedLogSomethingCommand,
            isDebug) {

    return Backbone.CommandRouter.extend({

        el: 'body',

        njs: null, //navigatorjs.Navigator
        stateViewMap: null, //navigatorjs.integration.StateViewMap
        stateUrlSyncer: null, //new navigatorjs.integration.StateUrlSyncer

        routes: {"": ""},

        initialize: function() {
            this.initializeNavigator();
            this.initializeModels();
            this.mapStates();
            this.bindCommands();

            if (isDebug) {
                this.addDebug();
            }

            var urlState = this.stateUrlSyncer.getUrlState();
            this.njs.start(urlState);

            this.injector.getInstance("testModel").set({name: 'Paul'});
        },

        initializeNavigator: function() {
            this.njs = new navigatorjs.Navigator();
            this.stateViewMap = new navigatorjs.integration.StateViewMap(this.njs,
                this.$el);

            this.stateUrlSyncer = new navigatorjs.integration.StateUrlSyncer(this.njs);
            this.stateUrlSyncer.usePushState();
            this.stateUrlSyncer.start();

            this.injector.map("njs").toValue(this.njs);
        },

        initializeModels: function() {
            this.injector.map('testModel').toSingleton(TestModel);
        },

        mapStates: function() {
            this.stateViewMap.mapState("").toView(TestView).withArguments({injector: this.injector});
        },

        bindCommands: function() {
            this.bindCommand(this.injector.getInstance('testModel'),
                "change",
                OnTestModelChangedLogSomethingCommand);
        },

        addDebug: function() {
            var debugConsole = new navigatorjs.features.DebugConsole(this.njs),
                $debugConsole = debugConsole.get$El(),
                cssPosition = {position: 'fixed', left: 10, bottom: 10};

            $debugConsole.css(cssPosition).appendTo('body');
        }
    });
});