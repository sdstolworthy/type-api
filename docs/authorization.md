# Authorization

Authorization is a separate service from authentication.

Authorization is permission-based with those permissions being assigned to _roles_ and those roles being assigned to users. This layer of abstraction ensures that we handle API permissions correctly while allowing proper users to manage roles and which users have access to those roles.

## Permissions

Permissions are API-based rules that define access control. A list of all available permissions are defined in an enum in [permission.entity.ts](../src/api/data/permission/permission.entity.ts).

## Roles

Roles have a many-to-many relationship with permissions. That is, a role may be given access to multiple permissions, and many roles may have access to the same permission.

Likewise, roles have a many-to-many relationship with users. In this way, users may be given access to different parts of the API without having to be assigned permissions individually. They are assigned a role which gives them access to all permissions within that role.

Because of the multi-level many-to-many relationships, a user may have a permission enabled through multiple roles. Users will have access to a permission if at least one of the roles they have been assigned has access to that permission.
