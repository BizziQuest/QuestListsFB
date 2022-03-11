import md5 from 'md5';
import pSBC, { toColor } from './pSBC';

function getGravatarForEmail(email) {
  const emailHash = md5(email);
  return `https://www.gravatar.com/avatar/${emailHash}?d=robohash`;
}

function getAvatarForUser(user) {
  if (user.useGravatar) return getGravatarForEmail(user.email, user.displayName);
  return (user.avatar || '/img/unknown_user.svg');
}

function useLightText(backgroundColor) {
  if (!backgroundColor) return null;
  const brightness = (backgroundColor.r * 299 + backgroundColor.g * 587 + backgroundColor.b * 114) / 1000;
  return brightness <= 125;
}

function contrastColor(foregroundColor, backgroundColor) {
  if (!backgroundColor) return foregroundColor;
  const lightText = useLightText(toColor(backgroundColor));
  if (lightText) return pSBC(0.90, foregroundColor);
  return pSBC(-0.90, foregroundColor);
}

export {
  getGravatarForEmail,
  getAvatarForUser,
  contrastColor,
  useLightText,
};
