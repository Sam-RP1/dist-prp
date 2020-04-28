'use strict'; //------------- GLOBAL VARIABLES -------------//

/**
* loadHeader() - Loads and renders the pages header component.
*/

async function loadHeader() {
  const url = '/api/user/avatar';
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const userAvatar = await response.text();
  const title = await headerBreadcrumb();
  const header = React.createElement(HeaderBar, {
    avatar: userAvatar,
    title: title
  });
  tabName();
  ReactDOM.render(header, document.getElementById('universal-header'));
}

;
/**
* headerBreadcrumb() - Generates the headers breadcrumb title.
*/

async function headerBreadcrumb() {
  const pathName = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);

  if (pathName === "/main/dashboard") {
    return React.createElement(ClassesBC, null);
  } else if (pathName === "/main/class") {
    const classId = urlParams.get('classId');
    const className = urlParams.get('className');
    const hrefClass = "/main/class?classId=" + classId + "&className=" + className;
    return React.createElement(ClassFragment, {
      hrefClass: hrefClass,
      className: className
    });
  } else if (pathName === "/main/assignment") {
    const classId = urlParams.get('classId');
    const className = urlParams.get('className');
    const asgmtId = urlParams.get('asgmtId');
    const asgmtName = urlParams.get('asgmtName');
    const hrefClass = "/main/class?classId=" + classId + "&className=" + className;
    const hrefAsgmt = "/main/assignment?classId=" + classId + "&className=" + className + "&asgmtId=" + asgmtId + "&asgmtName=" + asgmtName;
    return React.createElement(AsgmtFragment, {
      hrefClass: hrefClass,
      className: className,
      hrefAsgmt: hrefAsgmt,
      asgmtName: asgmtName
    });
  }
}

;
/**
* tabName() - Sets the browsers tab name.
*/

function tabName() {
  const pathName = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);

  if (pathName === "/main/dashboard") {
    document.title = "Dashboard";
  } else if (pathName === "/main/class") {
    document.title = urlParams.get('className');
  } else {
    document.title = urlParams.get('asgmtName');
  }
}

;
/**
* HeaderBar() - Contains the HTML for the header component.
* @return returns the HTML for the header component
*/

function HeaderBar(props) {
  return React.createElement("div", {
    className: "header-container transition-03"
  }, React.createElement("section", {
    className: "logo-wrapper-44"
  }, React.createElement("a", {
    href: "/main/dashboard"
  }, React.createElement("img", {
    className: "logo",
    src: "../assets/media/logo/p-white-bg.png",
    alt: "Peer Review Portal"
  }))), React.createElement("section", {
    id: "header-seperator"
  }), React.createElement("section", {
    className: "header-breadcrumb-wrapper txt-l1"
  }, props.title), React.createElement("section", {
    className: "header-btns"
  }, React.createElement("div", {
    className: "btn-container"
  }, React.createElement("div", {
    id: "info-btn"
  }, React.createElement("span", {
    onClick: renderInfoModal,
    className: "fas fa-info-circle pointer"
  })), React.createElement("img", {
    onClick: toggleAvatarMenu,
    id: "avatar-img",
    src: props.avatar,
    alt: "Profile Image Placeholder"
  })), React.createElement("div", {
    id: "avatar-menu"
  }, React.createElement("h1", {
    id: "logout",
    onClick: gLogout
  }, "Logout"))));
}

;
/**
* toggleAvatarMenu() - Toggles the position of the 'avatar-menu' in the browser.
*/

async function toggleAvatarMenu() {
  const menu = document.getElementById('avatar-menu');

  if (menu.style.right === '190%') {
    menu.style.right = '-500%';
  } else {
    menu.style.right = '190%';
  }
}

;
/**
* gLogout() - Logs the current user out of the application via their google account.
*/

function gLogout() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    logout();
  });
}

;
/**
* logout() - Logs the current user out and redirects them to the '/'.
*/

async function logout() {
  const url = '/auth/logout';
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    redirect: 'follow'
  });
  window.location.href = '/';
}

; // React Fragments

function ClassFragment(props) {
  return React.createElement(React.Fragment, null, React.createElement(ClassesBC, null), React.createElement(ArrowBC, null), React.createElement(ClassElemBC, {
    href: props.hrefClass,
    name: props.className
  }));
}

;

function AsgmtFragment(props) {
  return React.createElement(React.Fragment, null, React.createElement(ClassesBC, null), React.createElement(ArrowBC, null), React.createElement(ClassElemBC, {
    href: props.hrefClass,
    name: props.className
  }), React.createElement(ArrowBC, null), React.createElement(AsgmtElemBC, {
    href: props.hrefAsgmt,
    name: props.asgmtName
  }));
}

; // JSX

function ClassesBC() {
  return React.createElement("li", {
    id: "header-classes"
  }, React.createElement("a", {
    href: "/main/dashboard"
  }, "Classes"));
}

;

function ClassElemBC(props) {
  return React.createElement("li", {
    id: "header-class"
  }, React.createElement("a", {
    href: props.href
  }, props.name));
}

;

function AsgmtElemBC(props) {
  return React.createElement("li", {
    id: "header-asgmt"
  }, React.createElement("a", {
    href: props.href
  }, props.name));
}

;

function ArrowBC() {
  return React.createElement("li", {
    id: "header-arrow"
  }, React.createElement("span", {
    class: "fas fa-angle-right"
  }));
}

;