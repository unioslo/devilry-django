/**
 *
 * Requires the following definitions in the django template:
 *
 *     {{ restfulapi.RestfulSimplifiedAssignmentGroup|extjs_model:"subject,period,assignment,users" }};
 *    
 *     {{ restfulapi.RestfulSimplifiedDelivery|extjs_model:"deadline,assignment_group" }};
 *     {{ restfulapi.RestfulSimplifiedDelivery|extjs_store }};
 *    
 *     {{ restfulapi.RestfulSimplifiedStaticFeedback|extjs_model }};
 *     {{ restfulapi.RestfulSimplifiedStaticFeedback|extjs_store }};
 *    
 *     {{ restfulapi.RestfulSimplifiedFileMeta|extjs_model }};
 *     {{ restfulapi.RestfulSimplifiedFileMeta|extjs_store }};
 *    
 *     {# These are used by the grade editor and only required is canExamine is true #}
 *     {{ gradeeditors.RestfulSimplifiedConfig|extjs_model }};
 *     {{ gradeeditors.RestfulSimplifiedFeedbackDraft|extjs_model }};
 *     {{ gradeeditors.RestfulSimplifiedFeedbackDraft|extjs_store }};
 *
 * The ones from ``restfulapi`` are for core classes, while the ones from
 * ``gradeeditors`` is from ``devilry.apps.gradeeditors``. You can dump this
 * code into the django template using:
 *
 *     {% include "extjshelpers/AssignmentGroupOverviewExtjsClasses.django.html" %}
 */
Ext.define('devilry.extjshelpers.assignmentgroup.AssignmentGroupOverview', {
    extend: 'Ext.panel.Panel',
    width: 1000,
    height: 800,
    layout: 'border',
    alias: 'widget.assignmentgroupoverview',
    requires: [
        'devilry.extjshelpers.assignmentgroup.DeliveryInfo',
        'devilry.extjshelpers.assignmentgroup.AssignmentGroupDetailsPanel',
        'devilry.extjshelpers.assignmentgroup.DeadlineListing',
        'devilry.extjshelpers.assignmentgroup.StaticFeedbackInfo',
        'devilry.extjshelpers.assignmentgroup.StaticFeedbackEditor',
        'devilry.extjshelpers.assignmentgroup.AssignmentGroupTitle',
        'devilry.extjshelpers.SingleRecordContainer'
    ],

    headingTpl: Ext.create('Ext.XTemplate',
        '<div class="treeheader">',
        '   <div class="level1">{parentnode__parentnode__parentnode__long_name}</div>',
        '   <div class="level2">{parentnode__parentnode__long_name}</div>',
        '   <div class="level3">{parentnode__long_name}</div>',
        '<div>'
    ),

    config: {
        /**
         * @cfg
        * ID of the div to render title to. Defaults to 'content-heading'.
        */
        renderTitleTo: 'content-heading',

        /**
         * @cfg
        * ID of the div to render the body to. Defaults to 'content-main'.
        */
        renderTo: 'content-main',

        /**
         * @cfg
         * Enable creation of new feedbacks? Defaults to ``false``.
         * See: {@link devilry.extjshelpers.assignmentgroup.DeliveryInfo#canExamine}.
         *
         * When this is ``true``, the authenticated user still needs to have
         * permission to POST new feedbacks for the view to work.
         */
        canExamine: false,

        /**
         * @cfg
         * AssignmentGroup ID.
         */
        assignmentgroupid: undefined,

        /**
         * @cfg
         * Use the administrator RESTful interface to store drafts? If this is
         * ``false``, we use the examiner RESTful interface.
         */
        isAdministrator: false // TODO: Recurse this down to FeedbackEditor
    },

    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    },


    initComponent: function() {
        this.createAttributes();
        this.createLayout();
        this.callParent(arguments);
        this.loadAssignmentgroupRecord();
    },

    /**
     * @private
     */
    createAttributes: function() {
        this.assignmentgroup_recordcontainer = Ext.create('devilry.extjshelpers.SingleRecordContainer');
        this.delivery_recordcontainer = Ext.create('devilry.extjshelpers.SingleRecordContainer');
        this.gradeeditor_config_recordcontainer = Ext.create('devilry.extjshelpers.SingleRecordContainer');

        this.title = Ext.create('devilry.extjshelpers.assignmentgroup.AssignmentGroupTitle', {
            renderTo: this.renderTitleTo,
            singlerecordontainer: this.assignmentgroup_recordcontainer
        });

        this.role = this.isAdministrator? 'administrator': 'examiner';
        this.assignmentgroupmodel = Ext.ModelManager.getModel(this.getSimplifiedClassName('SimplifiedAssignmentGroup'));
        this.deliverymodel = Ext.ModelManager.getModel(this.getSimplifiedClassName('SimplifiedDelivery'));
        this.filemetastore = Ext.data.StoreManager.lookup(this.getSimplifiedClassName('SimplifiedFileMetaStore'));
        this.staticfeedbackstore = Ext.data.StoreManager.lookup(this.getSimplifiedClassName('SimplifiedStaticFeedbackStore'));
        this.gradeeditor_config_model = Ext.ModelManager.getModel(Ext.String.format(
            'devilry.apps.gradeeditors.simplified.{0}.SimplifiedConfig',
            this.role
        ));
    },

    /**
     * @private
     */
    loadAssignmentgroupRecord: function() {
        this.assignmentgroupmodel.load(this.assignmentgroupid, {
            scope: this,
            success: function(record) {
                this.assignmentgroup_recordcontainer.setRecord(record);

                // Load grade editor
                this.gradeeditor_config_model.load(record.data.parentnode, {
                    scope: this,
                    success: function(record) {
                        this.gradeeditor_config_recordcontainer.setRecord(record);
                    },
                    failure: function() {
                        // TODO: Handle errors
                    }
                });
            },
            failure: function() {
                // TODO: Handle errors
            }
        });
    },

    /**
     * @private
     */
    getSimplifiedClassName: function(name) {
        var classname = Ext.String.format(
            'devilry.apps.{0}.simplified.{1}',
            this.role, name
        );
        return classname;
    },

    /**
     * @private
     */
    createLayout: function() {
        Ext.apply(this, {
            items: [{
                region: 'west',
                layout: 'fit',
                width: 220,
                xtype: 'panel',
                collapsible: true,   // make collapsible
                //titleCollapse: true, // click anywhere on title to collapse.
                split: true,
                items: [{
                    xtype: 'panel',
                    layout: 'border',
                    items: [{
                        region: 'north',
                        items: [{
                            // TODO: We do not need this. Should just have is_open as part of the workflow, and ID is not something users should need
                            xtype: 'assignmentgroupdetailspanel',
                            bodyPadding: 10,
                            singlerecordontainer: this.assignmentgroup_recordcontainer
                        }]
                    }, {
                        region: 'center',
                        items: [{
                            xtype: 'deadlinelisting',
                            title: 'Deliveries',
                            assignmentgroup_recordcontainer: this.assignmentgroup_recordcontainer,
                            delivery_recordcontainer: this.delivery_recordcontainer,
                            deliverymodel: this.deliverymodel,
                            enableDeadlineCreation: this.canExamine
                        }]
                    }]
                }]
            }, {
                region: 'center',
                layout: 'border',
                items: [{
                    region: 'north',
                    xtype: 'deliveryinfo',
                    delivery_recordcontainer: this.delivery_recordcontainer,
                    filemetastore: this.filemetastore
                }, {
                    region: 'center',
                    items: [{
                        xtype: this.canExamine? 'staticfeedbackeditor': 'staticfeedbackinfo',
                        staticfeedbackstore: this.staticfeedbackstore,
                        delivery_recordcontainer: this.delivery_recordcontainer,
                        isAdministrator: this.isAdministrator, // Only required by staticfeedbackeditor
                        gradeeditor_config_recordcontainer: this.gradeeditor_config_recordcontainer // Only required by staticfeedbackeditor
                    }]
                }]
            }],
        });
    }
});
