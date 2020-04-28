'use strict';

//------------- GLOBAL VARIABLES -------------//
let userTier;

/**
* getUserTier() - Requests the tier of the current user from the server.
*/
async function getUserTier() {
  const url = '/api/user/tier';
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  userTier = await response.json();
};

/**
* loadScripts() - Calls the according functions to load the page.
*/
async function loadScripts() {
  await getUserTier();
  await loadHeader();
  dashboardUtilityBar();
  await dashboardContents();
  hideHiddenClasses();
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  })
};

/**
* hideHiddenClasses() - Hides classes that the user has currently hidden, using data from a cookie.
*/
async function hideHiddenClasses() {
  const cookieName = "prpUserCookie";
  const cookie = await getCookie(cookieName);
  let cookieArr = cookie.split(',');
  if (!cookieArr[0] == "") {
    for (let i = 0; i < cookieArr.length; i++) {
      const elems = document.getElementsByClassName(cookieArr[i]);
      elems[0].style.display = "none";
      elems[1].style.display = "none";
    }
  }
}

/**
* getCookie(cname) - Gets a cookie, using its name, and decodes it.
* @param {String} cname The cookies name
* @return {String} Name length and cookie length
*/
function getCookie(cname) {
  const name = cname + "=";
  const decodedCookies = decodeURIComponent(document.cookie);
  const cookieArr = decodedCookies.split(';');
  for(let i = 0; i <cookieArr.length; i++) {
    let cookie = cookieArr[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return NULL;
}

window.addEventListener('load', loadScripts);
