import { ROLES } from './roles'

export const getRoleName = (num) =>
  Object.keys(ROLES).find(key => ROLES[key] === num)
