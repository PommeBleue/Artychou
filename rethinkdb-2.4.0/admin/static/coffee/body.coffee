# Copyright 2010-2012 RethinkDB, all rights reserved.

app = require('./app.coffee')
driver = app.driver
system_db = app.system_db
topbar = require('./topbar.coffee')
navbar = require('./navbar.coffee')
models = require('./models.coffee')
modals = require('./modals.coffee')
router = require('./router.coffee')
VERSION = require('rethinkdb-version')

r = require('rethinkdb')

class MainContainer extends Backbone.View
    template: require('../handlebars/body-structure.hbs')
    id: 'main_view'

    initialize: =>
        @fetch_ajax_data()

        @databases = new models.Databases
        @tables = new models.Tables
        @servers = new models.Servers
        @issues = new models.Issues
        @dashboard = new models.Dashboard

        @navbar = new navbar.NavBarView
            databases: @databases
            tables: @tables
            servers: @servers
            container: @

        @topbar = new topbar.Container
            model: @dashboard
            issues: @issues

    # Should be started after the view is injected in the DOM tree
    start_router: =>
        @router = new router.BackboneCluster
            navbar: @navbar
        Backbone.history.start()

        @navbar.init_typeahead()

    fetch_ajax_data: =>
        driver.connect (error, conn) =>
            if error?
                console.log(error)
                @fetch_data(null)
            else
                conn.server (error, me) =>
                    driver.close conn
                    if error?
                        console.log(error)
                        @fetch_data(null)
                    else
                        @fetch_data(me)

    fetch_data: (me) =>
        query = r.expr
            tables: r.db(system_db).table('table_config').pluck('db', 'name', 'id').coerceTo("ARRAY")
            servers: r.db(system_db).table('server_config').pluck('name', 'id').coerceTo("ARRAY")
            issues: driver.queries.issues_with_ids()
            num_issues: r.db(system_db).table('current_issues').count()
            num_servers: r.db(system_db).table('server_config').count()
            num_tables: r.db(system_db).table('table_config').count()
            num_available_tables: r.db(system_db).table('table_status')('status').filter( (status) ->
                status("all_replicas_ready")
            ).count()
            me: if me.proxy then "<proxy node>" else me.name


        @timer = driver.run query, 5000, (error, result) =>
            if error?
                console.log(error)
            else
                for table in result.tables
                    @tables.add new models.Table(table), {merge: true}
                    delete result.tables
                for server in result.servers
                    @servers.add new models.Server(server), {merge: true}
                    delete result.servers
                @issues.set(result.issues)
                delete result.issues

                @dashboard.set result

    render: =>
        @$el.html @template()
        @$('#topbar').html @topbar.render().$el
        @$('#navbar-container').html @navbar.render().$el

        @

    remove: =>
        driver.stop_timer @timer
        @navbar.remove()


class IsDisconnected extends Backbone.View
    el: 'body'
    className: 'is_disconnected_view'
    template: require('../handlebars/is_disconnected.hbs')
    message: require('../handlebars/is_disconnected_message.hbs')
    initialize: =>
        @render()
        setInterval ->
            driver.run_once r.expr(1)
        , 2000

    render: =>
        @$('#modal-dialog > .modal').css('z-index', '1')
        @$('.modal-backdrop').remove()
        @$el.append @template()
        @$('.is_disconnected').modal
            'show': true
            'backdrop': 'static'
        @animate_loading()

    animate_loading: =>
        if @$('.three_dots_connecting')
            if @$('.three_dots_connecting').html() is '...'
                @$('.three_dots_connecting').html ''
            else
                @$('.three_dots_connecting').append '.'
            setTimeout(@animate_loading, 300)

    display_fail: =>
        @$('.animation_state').fadeOut 'slow', =>
            $('.reconnecting_state').html(@message)
            $('.animation_state').fadeIn('slow')


exports.MainContainer = MainContainer
exports.IsDisconnected = IsDisconnected
