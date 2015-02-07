define([
    'backbone',
    'hbs!templates/TestView',
    'TweenLite'
], function(Backbone, template, TweenLite) {
    return Backbone.View.extend({
        className: 'testView',

        navigatorBehaviors: ['IHasStateTransition'],

        testModel: 'inject',
        showBlueScreenTrigger: 'inject',

        events: {
            'click .blue': 'onClickBlue'
        },

        initialize: function() {
            this.listenTo(this.testModel, 'change:name', this.render);
        },

        render: function() {
            this.$el.html(template(this.testModel.toJSON()));

            return this;
        },

        onClickBlue: function() {
            var demoParam1 = true,
                demoParam2 = 'Just to show how to pass vars to a command';

            this.showBlueScreenTrigger.dispatch(demoParam1, demoParam2);
        },

        transitionIn: function(callOnComplete) {
            TweenLite.fromTo(
                this.$el,
                1.5,
                {alpha: 0},
                {alpha: 1, onComplete: callOnComplete});
        },

        transitionOut: function(callOnComplete) {
            TweenLite.to(
                this.$el,
                1.5,
                {alpha: 0, onComplete: callOnComplete});
        }
    });
});
