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
  assignmentBar();
  getAssignmentContents();
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  })
};

window.addEventListener('load', loadScripts);
