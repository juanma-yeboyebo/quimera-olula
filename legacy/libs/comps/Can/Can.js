import { ACL } from "quimera/lib";

function Can({ children, rule, rules }) {
  const permissionRules = [...(rules ?? []), ...(rule ? [rule] : [])];

  return (
    permissionRules
      .map(permissionRule => (permissionRule ? ACL.can(permissionRule) : true))
      .some(can => !!can) && children
  );
}

export default Can;
