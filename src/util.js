import md5 from 'md5';

function getGravatarForEmail(email, username) {
  const emailHash = md5(email);
  const escapedName = encodeURIComponent(username);
  return `https://www.gravatar.com/avatar/${emailHash}?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${escapedName}/128`;
}

function getAvatarForUser(user) {
  if (user.useGravatar) return getGravatarForEmail(user.email, user.displayName);
  return (user.avatar || '/img/unknown_user.svg');
}
export {
  getGravatarForEmail,
  getAvatarForUser,
};
