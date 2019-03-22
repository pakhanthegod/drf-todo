from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners.
    """
    def has_objects_persmissions(self, request, view, obj):
        return obj.owner == request.user