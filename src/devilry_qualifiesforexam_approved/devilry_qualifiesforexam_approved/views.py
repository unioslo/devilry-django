from django.views.generic import RedirectView
from django.core.urlresolvers import reverse

from devilry.utils.groups_groupedby_relatedstudent_and_assignment import GroupsGroupedByRelatedStudentAndAssignment
from devilry_qualifiesforexam.pluginhelpers import QualifiesForExamViewMixin


# TODO: Auth


class AllApprovedView(RedirectView, QualifiesForExamViewMixin):
    permanent = False
    query_string = True

    def _passed_all_assignments(self, aggregated_relstudentinfo):
        for grouplist in aggregated_relstudentinfo.iter_groups_by_assignment():
            feedback = grouplist.get_feedback_with_most_points()
            if not (feedback and feedback.is_passing_grade):
                return False
        return True

    def _get_passing_students(self):
        passing_relatedstudentsids = []
        grouper = GroupsGroupedByRelatedStudentAndAssignment(self.period)
        for aggregated_relstudentinfo in grouper.iter_relatedstudents_with_results():
            if self._passed_all_assignments(aggregated_relstudentinfo):
                passing_relatedstudentsids.append(aggregated_relstudentinfo.relatedstudent.id)
        return passing_relatedstudentsids

    def get(self, request):
        self.get_plugin_input() # set self.periodid and self.pluginsessionid
        self.save_plugin_output(self._get_passing_students())
        return super(AllApprovedView, self).get(request)

    def get_redirect_url(self, **kwargs):
        return reverse('devilry_qualifiesforexam_ui')