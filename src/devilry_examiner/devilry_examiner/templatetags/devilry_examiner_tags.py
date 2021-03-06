from django import template
from django.utils.translation import ugettext_lazy as _
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.filter(name='formatted_status')
@stringfilter
def formatted_status(value):
    if value == 'waiting-for-feedback':
        return _("Waiting for feedback")
    elif value == 'waiting-for-deliveries':
        return _("Waiting for deliveries")
    elif value == 'no-deadlines':
        return _("No deadlines")
    elif value == 'corrected':
        return _("Corrected")
    elif value == 'closed-without-feedback':
        return _("Closed without feedback")
    return value

@register.filter
def format_is_passing_grade(is_passing_grade):
    if is_passing_grade:
        return _('passed')
    else:
        return _('failed')

@register.filter
def formatted_delivery_count(count):
    if count == 0:
        return _("No deliveries")
    if count == 1:
        return _("{0} delivery received").format(count)
    return _("{0} deliveries received").format(count)

@register.filter
def get_feedback_url(assignment):
    return assignment.get_gradingsystem_plugin_api().get_bulkedit_feedback_url(assignment.id)


@register.filter(name='status_to_buttontext')
@stringfilter
def status_to_buttontext(value):
    if value == 'waiting-for-feedback':
        return _("Write feedback")
    elif value == 'waiting-for-deliveries':
        return _("Waiting for deliveries")
    elif value == 'no-deadlines':
        return _("No deadlines")
    elif value == 'corrected':
        return _("Show feedback")
    elif value == 'closed-without-feedback':
        return _("Closed without feedback")
    return value


@register.filter
def feedback_to_bootstrapclass(feedback):
    if feedback.is_passing_grade:
        return 'success'
    else:
        return 'warning'

@register.filter
def group_delivery_status_to_bootstrapclass(group):
    if group.delivery_status == 'waiting-for-something':
        return "muted"
    elif group.delivery_status == 'corrected':
        return feedback_to_bootstrapclass(group.feedback)
    else:
        return "danger"
