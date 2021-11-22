import store from '../store'

export function hasPermission(permission) {
  return true;
  let myPermissions = store.getters.permissions;
  return myPermissions.indexOf(permission) > -1;
}