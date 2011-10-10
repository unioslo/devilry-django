/** Panel to show StaticFeedback info.
 */
Ext.define('devilry.extjshelpers.assignmentgroup.StaticFeedbackInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.staticfeedbackinfo',
    cls: 'widget-staticfeedbackinfo',
    requires: [
        'devilry.extjshelpers.Pager',
        'devilry.extjshelpers.SingleRecordContainer',
        'devilry.extjshelpers.assignmentgroup.FileMetaBrowserWindow',
        'devilry.extjshelpers.assignmentgroup.StaticFeedbackView',
        'devilry.extjshelpers.SingleRecordContainerDepButton'
    ],

    config: {
        /**
         * @cfg
         * FileMeta ``Ext.data.Store``. (Required).
         * _Note_ that ``filemetastore.proxy.extraParams`` is changed by this
         * class.
         */
        filemetastore: undefined,

        /**
         * @cfg
         * FileMeta ``Ext.data.Store``. (Required).
         * _Note_ that ``filemetastore.proxy.extraParams`` is changed by this
         * class.
         */
        staticfeedbackstore: undefined,

        /**
         * @cfg
         * A {@link devilry.extjshelpers.SingleRecordContainer} for Delivery.
         */
        delivery_recordcontainer: undefined
    },


    constructor: function(config) {
        this.addEvents('afterStoreLoadMoreThanZero');
        this.callParent([config]);
        this.initConfig(config);
    },
    
    initComponent: function() {
        this.staticfeedback_recordcontainer = Ext.create('devilry.extjshelpers.SingleRecordContainer');
        this.bodyContent = Ext.create('Ext.container.Container');

        Ext.apply(this, {
            items: [this.bodyContent],
            tbar: this.getToolbarItems()
        });
        this.callParent(arguments);

        this.staticfeedbackstore.pageSize = 1;
        this.staticfeedbackstore.proxy.extraParams.orderby = Ext.JSON.encode(['-save_timestamp']);

        this.staticfeedback_recordcontainer.addListener('setRecord', this.onSetStaticFeedbackRecord, this);
        this.staticfeedbackstore.addListener('load', this.onLoadStaticfeedbackstore, this);
        if(this.delivery_recordcontainer.record) {
            this.onLoadDelivery();
        }
        this.delivery_recordcontainer.addListener('setRecord', this.onLoadDelivery, this);
    },


    getToolbarItems: function() {
        return [{
            xtype: 'singlerecordcontainerdepbutton',
            singlerecordcontainer: this.delivery_recordcontainer,
            text: 'Browse files',
            scale: 'large',
            listeners: {
                scope: this,
                click: function() {
                    Ext.create('devilry.extjshelpers.assignmentgroup.FileMetaBrowserWindow', {
                        filemetastore: this.filemetastore,
                        deliveryid: this.delivery_recordcontainer.record.data.id
                    }).show();
                }
            }
        }, {
            xtype: 'singlerecordcontainerdepbutton',
            singlerecordcontainer: this.delivery_recordcontainer,
            scale: 'large',
            text: 'Download all files (.zip)',
            listeners: {
                scope: this,
                click: function(view, record, item) {
                    var url = Ext.String.format(
                        '{0}/student/show-delivery/compressedfiledownload/{1}',
                        DevilrySettings.DEVILRY_URLPATH_PREFIX,
                        this.delivery_recordcontainer.record.data.id
                    );
                    window.open(url, 'download');
                }
            }
        }, '->', {
            xtype: 'devilrypager',
            store: this.staticfeedbackstore,
            width: 200,
            reverseDirection: true,
            middleLabelTpl: Ext.create('Ext.XTemplate',
                '<tpl if="firstRecord">',
            '   {currentNegativePageOffset})&nbsp;&nbsp;',
            '   {firstRecord.data.save_timestamp:date}',
            '</tpl>'
            )
        }];
    },

    /**
     * @private
     */
    onLoadDelivery: function() {
        this.staticfeedbackstore.proxy.extraParams.filters = Ext.JSON.encode([{
            field: 'delivery',
            comp: 'exact',
            value: this.delivery_recordcontainer.record.data.id
        }]);
        this.staticfeedbackstore.load();
    },


    onSetStaticFeedbackRecord: function() {
        var isactive = this.staticfeedbackstore.currentPage == 1;
        this.setBody({
            xtype: 'staticfeedbackview',
            padding: 10,
            singlerecordontainer: this.staticfeedback_recordcontainer,
            extradata: {
                isactive: isactive
            }
        });
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    },

    onLoadStaticfeedbackstore: function(store, records, successful) {
        if(successful) {
            if(records.length == 0) {
                this.bodyWithNoFeedback();
            }
            else {
                this.staticfeedback_recordcontainer.setRecord(records[0]);
                this.fireEvent('afterStoreLoadMoreThanZero');
            }
       } else {
            // TODO: handle failure
        }
    },

    setBody: function(content) {
        this.bodyContent.removeAll();
        this.bodyContent.add(content);
    },


    bodyWithNoFeedback: function() {
        this.setBody({
            xtype: 'box',
            padding: 10,
            cls: 'no-feedback',
            html: 'No feedback yet'
        });
    }
});
