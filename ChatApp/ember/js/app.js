App = Ember.Application.create();

App.IndexRoute=Ember.Route.extend({
	model:function()
	{
		return displayedPosts
	},
	actions: {
		invalidateModel: function(){
			this.refresh();
		}
	}
});

App.IndexController = Ember.ArrayController.extend({
  actions: {
    getLatest: function() {
      Ember.Logger.log('Controller requesting route to refresh...');
      this.send('invalidateModel');
    }
  }
});

App.Message = DS.Model.extend(
{
	body: DS.attr("string"),
	recipient: DS.attr("string"),
	when: DS.attr("date")
});

App.Messages=DS.Model.extend(
{
	messages: DS.hasMany("message")
});

var displayedPosts=[]

Ember.Handlebars.registerBoundHelper('currentDate', function(date) {
  return moment(date).fromNow()
});

Handlebars.registerHelper('ifCond', function(v1, options) {
  if(options.contexts[0][v1]==pod.getUserId()) {
    return options.fn(this);
  }
  return options.inverse(this);
});