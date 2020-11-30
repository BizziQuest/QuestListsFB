import md5 from 'md5';

function getGravatarForEmail(email) {
  return `https://www.gravatar.com/avatar/${md5(email)}`;
}

function getAvatarForUser(user) {
  return user.useGravatar ? getGravatarForEmail(user.email) : (user.avatar || '/img/unknown_user.svg');
}
export {
  getGravatarForEmail,
  getAvatarForUser,
};
