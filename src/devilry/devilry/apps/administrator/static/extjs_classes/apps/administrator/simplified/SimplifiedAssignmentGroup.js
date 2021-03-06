// Autogenerated by the dev_coreextjsmodels script. DO NOT CHANGE MANUALLY

/*******************************************************************************
 * NOTE: You will need to add the following before your application code:
 *
 *    Ext.Loader.setConfig({
 *        enabled: true,
 *        paths: {
 *            'devilry': DevilrySettings.DEVILRY_STATIC_URL + '/extjs_classes'
 *        }
 *    });
 *    Ext.syncRequire('devilry.extjshelpers.RestProxy');
 ******************************************************************************/
Ext.define('devilry.apps.administrator.simplified.SimplifiedAssignmentGroup', {
    extend: 'Ext.data.Model',
    requires: ['devilry.extjshelpers.RestProxy'],
    fields: [
        {
            "type": "int", 
            "name": "id"
        }, 
        {
            "type": "auto", 
            "name": "name"
        }, 
        {
            "type": "bool", 
            "name": "is_open"
        }, 
        {
            "type": "auto", 
            "name": "parentnode"
        }, 
        {
            "type": "auto", 
            "name": "feedback"
        }, 
        {
            "type": "auto", 
            "name": "latest_delivery_id"
        }, 
        {
            "type": "auto", 
            "name": "latest_deadline_id"
        }, 
        {
            "type": "auto", 
            "name": "latest_deadline_deadline"
        }, 
        {
            "type": "auto", 
            "name": "number_of_deliveries"
        }, 
        {
            "type": "int", 
            "name": "feedback__points"
        }, 
        {
            "type": "auto", 
            "name": "feedback__grade"
        }, 
        {
            "type": "bool", 
            "name": "feedback__is_passing_grade"
        }, 
        {
            "type": "auto", 
            "name": "tags__tag"
        }, 
        {
            "type": "auto", 
            "name": "parentnode__long_name"
        }, 
        {
            "type": "auto", 
            "name": "parentnode__short_name"
        }, 
        {
            "type": "bool", 
            "name": "parentnode__anonymous"
        }, 
        {
            "type": "int", 
            "name": "parentnode__delivery_types"
        }, 
        {
            "type": "date", 
            "name": "parentnode__publishing_time", 
            "dateFormat": "Y-m-d\\TH:i:s"
        }, 
        {
            "type": "int", 
            "name": "feedback__delivery__number"
        }, 
        {
            "type": "date", 
            "name": "feedback__delivery__time_of_delivery", 
            "dateFormat": "Y-m-d\\TH:i:s"
        }, 
        {
            "type": "int", 
            "name": "feedback__delivery__delivery_type"
        }, 
        {
            "type": "auto", 
            "name": "feedback__delivery__deadline"
        }, 
        {
            "type": "auto", 
            "name": "parentnode__parentnode"
        }, 
        {
            "type": "auto", 
            "name": "parentnode__parentnode__long_name"
        }, 
        {
            "type": "auto", 
            "name": "parentnode__parentnode__short_name"
        }, 
        {
            "type": "auto", 
            "name": "candidates"
        }, 
        {
            "type": "auto", 
            "name": "candidates__student__username"
        }, 
        {
            "type": "auto", 
            "name": "candidates__identifier"
        }, 
        {
            "type": "auto", 
            "name": "examiners__user__username"
        }, 
        {
            "type": "auto", 
            "name": "feedback__rendered_view"
        }, 
        {
            "type": "auto", 
            "name": "candidates__student__devilryuserprofile__full_name"
        }, 
        {
            "type": "auto", 
            "name": "parentnode__parentnode__parentnode"
        }, 
        {
            "type": "auto", 
            "name": "parentnode__parentnode__parentnode__long_name"
        }, 
        {
            "type": "auto", 
            "name": "parentnode__parentnode__parentnode__short_name"
        }, 
        {
            "type": "auto", 
            "name": "fake_examiners"
        }, 
        {
            "type": "auto", 
            "name": "fake_candidates"
        }, 
        {
            "type": "auto", 
            "name": "fake_tags"
        }
    ],
    idProperty: 'id',
    proxy: {
        type: 'devilryrestproxy',
        url: '/administrator/restfulsimplifiedassignmentgroup/',
        headers: {
            'X_DEVILRY_USE_EXTJS': true
        },
        extraParams: {
            getdata_in_qrystring: true,
            result_fieldgroups: '["feedback", "tags", "assignment", "feedbackdelivery", "period", "candidates", "users", "feedback_rendered_view", "students_full_name", "subject"]'
        },
        reader: {
            type: 'json',
            root: 'items',
            totalProperty: 'total'
        },
        writer: {
            type: 'json'
        }
    }
});