import md5 from 'md5';
import pSBC, { toColor } from './pSBC';

function getGravatarForEmail(email, username) {
  const emailHash = md5(email);
  const escapedName = encodeURIComponent(username);
  return `https://www.gravatar.com/avatar/${emailHash}?d=wavatar&r=g`;
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

function setCookie(cname, cvalue, exdays=365) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  const cookieRegex = new RegExp(`${cname}\s*=\s*(.*?)($|;)`, 'gi')
  let newCookie = document.cookie.replaceAll(cookieRegex, "");
  if (!newCookie.includes("expires")) newCookie = `${newCookie}; ${expires}; path=/`;
  document.cookie = `${cname}=${cvalue}; ${newCookie};`;
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export {
  getGravatarForEmail,
  getAvatarForUser,
  contrastColor,
  useLightText,
  getCookie,
  setCookie
};
