export function destinationForUser(user) {
  if (user.usertype === 'Admin') return '/admin';
  if (user.usertype === 'Contractor') return '/contractor/dashboard';
  return '/dashboard';
}
