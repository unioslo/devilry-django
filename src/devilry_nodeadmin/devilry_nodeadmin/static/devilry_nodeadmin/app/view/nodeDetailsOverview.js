Ext.define('devilry_nodeadmin.view.nodeDetailsOverview', {
    extend: 'Ext.view.View',
    alias: 'widget.nodedetailsoverview',
    cls: 'bootstrap nodedetailsoverview',
    tpl: [
        '<tpl for=".">',
        '<h1>About <i>{ short_name }</i></h1>',
        '<h3><i>{ long_name }</i></h3>',
        '<div>{ subject_count } emner</div>',
        '<div>{ assignment_count } oppgaver</div>',
        '<hr />',
        '<h4>Subjects</h4>',
        '<ul>',
        '<tpl for="subjects">',
        '<li><a href="/devilry_subjectadmin/#/subject/{ id }/"><i class="icon icon-chevron-back"></i>{ long_name }</a></li>',
        '</tpl>',
        '</ul>',
        '</tpl>'
    ],

    itemSelector: 'div.node',

    initComponent: function() {
        this.store = Ext.create( 'devilry_nodeadmin.store.NodeDetails' );
        this.store.proxy.url = Ext.String.format('/devilry_nodeadmin/rest/node/{0}/details', this.node_pk );
        this.callParent(arguments);
    }

});