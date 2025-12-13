from django.contrib import admin
from accounts.models import AppUser, MentorProfile, MenteeProfile, Language

# Register your models here.
admin.site.register(AppUser)
admin.site.register(MentorProfile)
admin.site.register(MenteeProfile)
admin.site.register(Language)
