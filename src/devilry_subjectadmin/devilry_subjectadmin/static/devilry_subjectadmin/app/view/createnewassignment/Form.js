Ext.define('devilry_subjectadmin.view.createnewassignment.Form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.createnewassignmentform',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.form.field.Text',
        'Ext.form.field.Hidden',
        'Ext.toolbar.Toolbar',
        //'devilry_extjsextras.form.DateField',
        //'devilry_extjsextras.form.TimeField',
        'devilry_extjsextras.form.DateTimeField',
        'devilry_extjsextras.CreateButton',
        'devilry_extjsextras.AlertMessageList',
        'devilry_subjectadmin.utils.UrlLookup',
        'devilry_extjsextras.form.Help',
        'devilry_subjectadmin.utils.BaseNodeHelp'
    ],

    /**
     * @cfg period_id
     */


    initComponent: function() {
        var cssclasses = 'devilry_subjectadmin_createnewassignmentform';
        if(this.cls) {
            cssclasses += ' ' + this.cls;
        }
        this.cls = cssclasses;

        Ext.apply(this, {
            border: false,
            layout: 'anchor',
            fieldDefaults: {
                labelAlign: 'top',
                labelStyle: 'font-weight: bold'
            },
            items: [{
                xtype: 'alertmessagelist'
            }, {
                xtype: 'container',
                layout: 'card',
                itemId: 'cardPanel',
                items: [{
                    xtype: 'panel',
                    itemId: 'pageOne',
                    bodyPadding: 20,
                    items: [{

                        // Long name
                        xtype: 'container',
                        layout: 'column',
                        items: [{
                            columnWidth: 1,
                            name: "long_name",
                            fieldLabel: gettext('Long name'),
                            xtype: 'textfield',
                            cls: 'hugefield',
                            emptyText: pgettext('createnewassignment', 'Example: Obligatory assignment one'),
                            allowBlank: false,
                            //fieldStyle: 'height:auto; font-size:20px; line-height:normal;',
                            padding: '0 20 0 0'
                        }, {
                            name: "short_name",
                            width: 300,
                            fieldLabel: gettext('Short name'),
                            xtype: 'textfield',
                            allowBlank: false,
                            emptyText: pgettext('createnewassignment', 'Example: oblig-1')
                        }]
                    }, {
                        xtype: 'box',
                        cls: 'bootstrap',
                        margin: '0 0 0 0',
                        html: [
                            '<p class="muted"><small>',
                                devilry_subjectadmin.utils.BaseNodeHelp.getShortAndLongNameHelp(),
                            '</small></p>'
                        ].join('')

                    }, {
                        xtype: 'container',
                        margin: '20 0 0 0',
                        layout: 'column',
                        items: [{
                            // How do students add deliveries
                            xtype: 'container',
                            columnWidth: 1,
                            padding: '0 40 20 0',
                            items: [{
                                xtype: 'radiogroup',
                                fieldLabel: gettext('How do students add deliveries?'),
                                vertical: true,
                                itemId: 'deliveryTypesRadioGroup',
                                cls: 'delivery_types-radiogroup',
                                columns: 1,
                                items: [{
                                    boxLabel: gettext('Using Devilry'),
                                    name: 'delivery_types',
                                    inputValue: 0,
                                    checked: true
                                }, {
                                    boxLabel: gettext('Not using Devilry'),
                                    name: 'delivery_types',
                                    inputValue: 1
                                }]
                            }, {
                                xtype: 'box',
                                cls: 'bootstrap',
                                margin: '0 0 0 3',
                                html: [
                                    '<p class="muted"><small>',
                                        gettext('If you only use Devilry to give feedback, and students deliver paper copies or through an alternative channel (oral presentation, email, ...), choose <em>Not using Devilry</em>.'),
                                    '</small></p>'
                                ].join('')
                            }]

                        }, {
                            // First deadline
                            xtype: 'container',
                            //columnWidth: 0.5,
                            width: 300,
                            items: [{
                                xtype: 'devilry_extjsextras-datetimefield',
                                cls: 'first_deadline',
                                itemId: 'firstDeadlineField',
                                name: 'first_deadline',
                                allowBlank: false,
                                width: 300,
                                fieldLabel: gettext('Submission date')
                            }, {
                                xtype: 'box',
                                cls: 'bootstrap',
                                itemId: 'firstDeadlineHelp',
                                margin: '0 0 0 0',
                                html: [
                                    '<p class="muted"><small>',
                                        gettext('Students must submit their delivery before this time.'),
                                    '</small></p>'
                                ].join('')
                            }]
                        }]

                    }, {
                        xtype: 'panel',
                        cls: 'devilry_discussionview_container',
                        
                        items: [{
                            xtype: 'panel',
                            id: 'advancedOptionsPanel',
                            title: [
                                '<div class="bootstrap">',
                                    '<span class="linklike">',
                                        gettext('Advanced options'),
                                    '</span>',
                                    '<small> (',
                                        gettext('click to expand'),
                                    ')</small>',
                                '</div>'
                            ].join(''),
                            collapsible: true,
                            collapsed: true,
                            animCollapse: false,
                            titleCollapse: true,
                            bodyPadding: 20,
                            defaults: {
                                margin: '20 0 0 0'
                            },
                            items: [{
                                // Anonymous?
                                xtype: 'checkboxfield',
                                margin: '0 0 0 0',
                                name: 'anonymous',
                                labelAlign: 'left',
                                boxLabel: gettext('Anonymous?')
                            }, {
                                xtype: 'box',
                                cls: 'bootstrap',
                                margin: '0 0 0 0',
                                html: [
                                    '<p class="muted"><small>',
                                        gettext('For exams, this should normally be checked. If an assignment is anonymous, examiners see candidate-id instead of any personal information about the students.'),
                                    '</small></p>'
                                ].join('')

                                // Publishing time
                            }, {
                                xtype: 'devilry_extjsextras-datetimefield',
                                width: 300,
                                fieldLabel: gettext('Publishing time'),
                                name: "publishing_time",
                                value: new Date()
                            }, {
                                xtype: 'box',
                                cls: 'bootstrap',
                                margin: '0 0 0 0',
                                itemId: 'publishingTimeHelp',
                                html: [
                                    '<p class="muted"><small>',
                                        gettext('Choose a time when students will be able to start adding deliveries on the assignment. The default is <em>now</em>. Note that students must be registered on the assignment as well before they can add any deliveries.'),
                                    '</small></p>'
                                ].join('')
                            }]
                        }]
                    }],


                    fbar: [{
                        xtype: 'button',
                        itemId: 'nextButton',
                        cls: 'createnewassignmentform_nextbutton',
                        text: gettext('Next'),
                        scale: 'large',
                        formBind: true, //only enabled once the form is valid
                        disabled: true
                    }]
                }, {
                    xtype: 'panel',
                    itemId: 'pageTwo',
                    bodyPadding: 20,
                    defaults: {
                        margin: '20 0 0 0'
                    },
                    items: [{
                        margin: 0,
                        xtype: 'box',
                        cls: 'metainfo bootstrap',
                        itemId: 'metainfo',
                        html: [
                            '<p>',
                                gettext('If none of the options below suite your needs, uncheck all the checkboxes, and set up students and examiners manually later.'),
                            '</p>'
                        ].join('')
                    }, {
                        // Add all related students
                        xtype: 'checkboxfield',
                        name:'add_all_relatedstudents',
                        cls: 'extrastronglabel',
                        margin: '20 0 0 0',
                        boxLabel: interpolate(gettext('Add all students registered on the %(period_term)s to this assignment?'), {
                            period_term: gettext('period')
                        }, true),
                        checked: true,
                        labelAlign: 'left'
                    }, {
                        xtype: 'box',
                        cls: 'bootstrap',
                        margin: '0 0 10 0',
                        tpl: [
                            '<p class="muted">',
                                gettext('Select this to add all students registered on the {period_term} to the assignment when it is created.'),
                                ' ',
                                gettext('You may want to view and edit <a {relatedstudents_link}>students</a>.'),
                            '</p>',
                            '<p class="muted">',
                                gettext('If you plan for students to work in project groups, you should still add them to the assignment now. You can organize them in project groups at any time, even after they have made deliveries.'),
                            '</p>'
                        ],
                        data: {
                            period_term: gettext('period'),
                            relatedstudents_link: Ext.String.format('href="{0}" target="_blank"',
                                devilry_subjectadmin.utils.UrlLookup.manageRelatedStudents(this.period_id))
                        }

                        // Autosetup examiners
                    }, {
                        xtype: 'checkboxfield',
                        margin: '20 0 0 0',
                        name: 'autosetup_examiners',
                        checked: true,
                        labelAlign: 'left',
                        cls: 'extrastronglabel',
                        boxLabel: gettext('Automatically setup examiners?')
                    }, {
                        xtype: 'box',
                        cls: 'bootstrap',
                        itemId: 'autosetup_examiners-help',
                        margin: '0 0 0 0',
                        tpl: [
                            '<p class="muted">',
                                gettext('Set examiners on students that have at least one tag in common with the examiner.'),
                                ' ',
                                gettext('E.g.: If you tag two examiners and 20 students with <em>group1</em>, those two examiners will be set up to correct those 20 students.'),
                            '</p>',
                            '<p class="muted">',
                                gettext('You may want to view and edit <a {relatedstudents_link}>students</a> or <a {relatedexaminers_link}>examiners</a>. The links open in a new window, so just close the windows and come back to this window when you are ready to create the assignment.'),
                            '</p>'
                        ],
                        data: {
                            relatedstudents_link: Ext.String.format('href="{0}" target="_blank"',
                                devilry_subjectadmin.utils.UrlLookup.manageRelatedStudents(this.period_id)),
                            relatedexaminers_link: Ext.String.format('href="{0}" target="_blank"',
                                devilry_subjectadmin.utils.UrlLookup.manageRelatedExaminers(this.period_id))
                        }
                    }],
                    fbar: [{
                        xtype: 'button',
                        itemId: 'backButton',
                        text: gettext('Back'),
                        scale: 'medium'
                    }, '->', {
                        xtype: 'createbutton',
                        minWidth: 200,
                        text: gettext('Create assignment'),
                        itemId: 'createButton',
                        scale: 'large',
                        formBind: true, //only enabled once the form is valid
                        disabled: true
                    }]
                }]
            }]
        });
        this.callParent(arguments);
    }
});
