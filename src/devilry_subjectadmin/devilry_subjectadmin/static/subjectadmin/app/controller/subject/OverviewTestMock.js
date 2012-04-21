Ext.define('subjectadmin.controller.subject.OverviewTestMock', {
    extend: 'subjectadmin.controller.subject.Overview',

    views: [
        'subject.Overview',
        'subject.ListOfPeriodsTestMock',
        'ActionList'
    ],

    stores: [
        'SubjectsTestMock',
        'PeriodsTestMock'
    ],

    getSubjectsStore: function() {
        return this.getSubjectsTestMockStore();
    },

    getPeriodsStore: function() {
        return this.getPeriodsTestMockStore();
    }
});
