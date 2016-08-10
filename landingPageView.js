define(['backbone', 'marionette',  'app', 'namsResView','namsChannel'], function (Backbone, Marionette, 
		App, NamsResView,NamsChannel) {
            var LandingPageView = Backbone.View.extend({
                template:function() {
                    var template = `
                        <a href="#research">Research</a>
                        <a href='#myRequest'>My Request</a>
                        <div id='appCommonHeaderRegion'></div>
                    `;
                    return(template);
                },
                render:function(){
                    this.$el.html(this.template());
                },
                el:'#main'
            });
            var landingPageView = new LandingPageView();
            landingPageView.render();

            var NamsRouter = Backbone.Router.extend({
                routes:{
                    "":'handleHome',
                    "research":'handleResearch',
                    "myRequest":'handleMyRequest'
                },
                handleHome:function(){
                    console.log('Home Router');
                },
                handleResearch:function() {
                    NamsChannel.lazyLoad(null);
                    var namsResView = new NamsResView();                    
                    namsResView.render();  
                },
                handleMyRequest:function(){                    
                    NamsChannel.lazyLoad(1);                    
                    var namsResView = new NamsResView();
                    namsResView.render();
                }
            });


            App.on('start',function(){
                console.log('Application started');
                var namsRouter = new NamsRouter();
                Backbone.history.start();
            });

            return(App)

        });