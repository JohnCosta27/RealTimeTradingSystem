import { useNavigate } from "@solidjs/router";
import { getUserId } from "@network"

/**
 * Returns the user id as a SolidJs hook,
 * or clear the users storage and redirect them to login.
 */
export const useUserId = (): string => {
  const id = getUserId();
  const nav = useNavigate();

  if (!id) {
    nav('/auth/login');
    return '';
  }

  return id;
}
