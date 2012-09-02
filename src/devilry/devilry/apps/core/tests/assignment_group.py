from datetime import datetime, timedelta

from django.test import TestCase
from django.core.exceptions import ValidationError

from ..models import AssignmentGroup
from ..models import Delivery
from ..testhelper import TestHelper
from ..models.model_utils import EtagMismatchException


class TestAssignmentGroup(TestCase, TestHelper):

    def setUp(self):
        self.add(nodes="uio:admin(uioadmin).ifi:admin(ifiadmin)",
                 subjects=["inf1100"],
                 periods=["old:begins(-2):ends(1)", "looong:admin(teacher1)"],
                 assignments=["assignment1", "assignment2"],
                 assignmentgroups=["g1:candidate(student1):examiner(examiner1)",
                                   "g2:candidate(student2):examiner(examiner2)",
                                   "g3:candidate(student3,student2):examiner(examiner1,examiner2,examiner3)"])
        self.add_to_path('uio.ifi;inf1100.old.oldassignment.group1:examiner(examiner3)')

    def test_where_is_admin(self):
        self.assertEquals(6, AssignmentGroup.where_is_admin(self.teacher1).count())

    def test_where_is_candidate(self):
        self.assertEquals(8, AssignmentGroup.where_is_candidate(self.student2).count())
        self.assertEquals(4, AssignmentGroup.where_is_candidate(self.student1).count())

    def test_published_where_is_candidate(self):
        self.assertEquals(8, AssignmentGroup.published_where_is_candidate(self.student2).count())
        self.assertEquals(4, AssignmentGroup.published_where_is_candidate(self.student3).count())

    def test_active_where_is_candidate(self):
        self.assertEquals(4, AssignmentGroup.active_where_is_candidate(self.student2).count())
        # Set publishing time to future
        self.inf1100_looong_assignment1.publishing_time = datetime.now() + timedelta(10)
        self.inf1100_looong_assignment1.save()
        self.assertEquals(2, AssignmentGroup.active_where_is_candidate(self.student2).count())
        
    def test_old_where_is_candidate(self):
        self.assertEquals(2, AssignmentGroup.old_where_is_candidate(self.student1).count())
        self.inf1100_looong.end_time = datetime.now() - timedelta(10)
        self.inf1100_looong.save()
        self.assertEquals(4, AssignmentGroup.old_where_is_candidate(self.student1).count())
        
    def test_where_is_examiner(self):
        self.assertEquals(8, AssignmentGroup.where_is_examiner(self.examiner2).count())
        self.assertEquals(5, AssignmentGroup.where_is_examiner(self.examiner3).count())
        self.inf1100_looong_assignment1_g2.examiners.create(user=self.examiner3)
        self.assertEquals(6, AssignmentGroup.where_is_examiner(self.examiner3).count())

    def test_published_where_is_examiner(self):
        self.assertEquals(8, AssignmentGroup.published_where_is_examiner(self.examiner2).count())
        self.assertEquals(8, AssignmentGroup.published_where_is_examiner(self.examiner1).count())
        self.assertEquals(0, AssignmentGroup.published_where_is_examiner(self.examiner1,
                    old=False, active=False).count())
        self.assertEquals(4, AssignmentGroup.published_where_is_examiner(self.examiner1,
                    old=True, active=False).count())
        self.assertEquals(4, AssignmentGroup.published_where_is_examiner(self.examiner1,
                    old=False, active=True).count())
        
    def test_active_where_is_examiner(self):
        self.assertEquals(4, AssignmentGroup.active_where_is_examiner(self.examiner1).count())
        self.assertEquals(2, AssignmentGroup.active_where_is_examiner(self.examiner3).count())

    def test_old_where_is_examiner(self):
        self.assertEquals(4, AssignmentGroup.old_where_is_examiner(self.examiner1).count())
        self.assertEquals(3, AssignmentGroup.old_where_is_examiner(self.examiner3).count())

    def test_get_students(self):
        self.assertEquals('student1', self.inf1100_looong_assignment1_g1.get_students())
        self.assertEquals('student3, student2', self.inf1100_looong_assignment1_g3.get_students())
        
    def test_get_candidates(self):
        self.assertEquals('student3, student2', self.inf1100_looong_assignment1_g3.get_candidates())
        self.inf1100_looong_assignment1.anonymous = True
        self.inf1100_looong_assignment1.save()
        #self.assertEquals('candidate-id missing, candidate-id missing',
        #                   self.inf1100_looong_assignment1_g3.get_candidates())
        cands = self.inf1100_looong_assignment1_g3.candidates.all()
        cand0 = cands[0]
        cand0.candidate_id = "2"
        cand0.update_identifier(True)
        cand0.save()
        cand1 = cands[1]
        cand1.candidate_id = "5"
        cand1.update_identifier(True)
        cand1.save()
        ag = AssignmentGroup.objects.get(id=self.inf1100_looong_assignment1_g3.id)
        self.assertEquals('2, 5', ag.get_candidates())

    def test_get_examiners(self):
        self.assertEquals('examiner1, examiner2, examiner3', self.inf1100_looong_assignment1_g3.get_examiners())

    def test_is_admin(self):
        self.assertFalse(self.inf1100_looong_assignment1_g3.is_admin(self.student1))
        self.assertFalse(self.inf1100_looong_assignment1_g3.is_admin(self.examiner1))
        self.assertTrue(self.inf1100_looong_assignment1_g3.is_admin(self.teacher1))
        self.assertTrue(self.inf1100_looong_assignment1_g3.is_admin(self.uioadmin))
        
    def test_is_examiner(self):
        self.assertTrue(self.inf1100_looong_assignment1_g1.is_examiner(self.examiner1))
        self.assertFalse(self.inf1100_looong_assignment1_g1.is_examiner(self.examiner2))

    def test_is_candidate(self):
        self.assertTrue(self.inf1100_looong_assignment1_g1.is_candidate(self.student1))
        self.assertFalse(self.inf1100_looong_assignment1_g1.is_candidate(self.student2))

    def test_clean_deadline_after_endtime(self):
        assignment_group = self.inf1100_looong_assignment1_g1
        assignment = assignment_group.parentnode
        assignment.parentnode.start_time = datetime(2010, 1, 1)
        assignment.parentnode.end_time = datetime(2011, 1, 1)
        assignment.publishing_time = datetime(2010, 1, 2)
        deadline = assignment_group.deadlines.create(deadline=datetime(2010, 5, 5), text=None)
        deadline.clean()
        deadline = assignment_group.deadlines.create(deadline=datetime(2012, 1, 1), text=None)
        self.assertRaises(ValidationError, deadline.clean)

    def test_clean_deadline_before_publishing_time(self):
        future3 = datetime.now() + timedelta(3)
        future6 = datetime.now() + timedelta(6)
        assignment_group = self.inf1100_looong_assignment1_g1
        oblig1 = assignment_group.parentnode
        oblig1.publishing_time = datetime.now()
        oblig1.parentnode.end_time = future6
        deadline = assignment_group.deadlines.create(deadline=future3, text=None)
        deadline.clean()
        oblig1.publishing_time = future6
        deadline = assignment_group.deadlines.create(deadline=future3, text=None)
        self.assertRaises(ValidationError, deadline.clean)

    def add_delivery(self, assignmentgroup, user):
        assignmentgroup.deliveries.create(delivered_by=user,
                                          successful=True)

    def test_etag_update(self):
        etag = datetime.now()
        obj = self.inf1100_looong_assignment1_g1
        obj.is_open = False
        self.assertRaises(EtagMismatchException, obj.etag_update, etag)
        try:
            obj.etag_update(etag)
        except EtagMismatchException as e:
            # Should not raise exception
            obj.etag_update(e.etag)
        obj2 = AssignmentGroup.objects.get(id=obj.id)
        self.assertFalse(obj2.is_open)


class TestAssignmentGroupSplit(TestCase):
    def setUp(self):
        self.testhelper = TestHelper()
        self.testhelper.add(nodes="uni",
                            subjects=["sub"],
                            periods=["p1"],
                            assignments=['a1'])

    def test_copy_all_except_candidates(self):
        self.testhelper.add_to_path('uni;sub.p1.a1.g1:candidate(student1):examiner(examiner1,examiner2,examiner3)')

        # Add d1 and deliveries
        self.testhelper.add_to_path('uni;sub.p1.a1.g1.d1:ends(1)')
        self.testhelper.add_delivery("sub.p1.a1.g1", {"firsttry.py": "print first"},
                                     time_of_delivery=-2) # days after deadline
        self.testhelper.add_delivery("sub.p1.a1.g1", {"secondtry.py": "print second"},
                                     time_of_delivery=-1) # days after deadline

        # Add d2 and deliveries
        self.testhelper.add_to_path('uni;sub.p1.a1.g1.d2:ends(4)')
        self.testhelper.add_delivery("sub.p1.a1.g1", {"thirdtry.py": "print third"},
                                     time_of_delivery=-1) # days after deadline

        g1 = self.testhelper.sub_p1_a1_g1
        g1copy = g1.copy_all_except_candidates()
        self.assertEquals(g1copy.candidates.count(), 0)

        # Examiners
        self.assertEquals(g1copy.examiners.count(), 3)
        examiner_usernames = [e.user.username for e in g1copy.examiners.all()]
        examiner_usernames.sort()
        self.assertEquals(examiner_usernames, ['examiner1', 'examiner2', 'examiner3'])

        # Deliveries
        deliveries = Delivery.objects.filter(deadline__assignment_group=g1).order_by('time_of_delivery')
        copydeliveries = Delivery.objects.filter(deadline__assignment_group=g1copy).order_by('time_of_delivery')
        self.assertEquals(len(deliveries), len(copydeliveries))
        self.assertEquals(len(deliveries), 3)
        for delivery, deliverycopy in zip(deliveries, copydeliveries):
            self.assertEquals(delivery.delivery_type, deliverycopy.delivery_type)
            self.assertEquals(delivery.time_of_delivery, deliverycopy.time_of_delivery)
            self.assertEquals(delivery.number, deliverycopy.number)
            self.assertEquals(delivery.delivered_by, deliverycopy.delivered_by)
            self.assertEquals(delivery.deadline.deadline, deliverycopy.deadline.deadline)
            self.assertEquals(delivery.delivered_by, deliverycopy.delivered_by)
            self.assertEquals(delivery.alias_delivery, deliverycopy.alias_delivery)
