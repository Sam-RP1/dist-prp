'use strict';

//------------- GLOBAL VARIABLES -------------//

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

  const header = <HeaderBar avatar={userAvatar} title={title}/>

  tabName();

  ReactDOM.render(
    header,
    document.getElementById('universal-header')
  );
};

/**
* headerBreadcrumb() - Generates the headers breadcrumb title.
*/
async function headerBreadcrumb() {
  const pathName = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);

  if (pathName === "/main/dashboard") {
    return (
      <ClassesBC />
    )
  } else if (pathName === "/main/class") {
    const classId = urlParams.get('classId');
    const className = urlParams.get('className');
    const hrefClass = "/main/class?classId=" + classId + "&className=" + className;
    return (<ClassFragment hrefClass={hrefClass} className={className} />)
  } else if (pathName === "/main/assignment") {
    const classId = urlParams.get('classId');
    const className = urlParams.get('className');
    const asgmtId = urlParams.get('asgmtId');
    const asgmtName = urlParams.get('asgmtName');
    const hrefClass = "/main/class?classId=" + classId + "&className=" + className;
    const hrefAsgmt = "/main/assignment?classId=" + classId + "&className=" + className + "&asgmtId=" + asgmtId + "&asgmtName=" + asgmtName;
    return (<AsgmtFragment hrefClass={hrefClass} className={className} hrefAsgmt={hrefAsgmt} asgmtName={asgmtName} />)
  }
};

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
};

/**
* HeaderBar() - Contains the HTML for the header component.
* @return returns the HTML for the header component
*/
function HeaderBar(props) {
  return (
    <div className="header-container transition-03">
    <section className="logo-wrapper-44">
    <a href="/main/dashboard">
    <img className="logo" src="../assets/media/logo/p-white-bg.png" alt="Peer Review Portal"></img>
    </a>
    </section>
    <section id="header-seperator"></section>
    <section className="header-breadcrumb-wrapper txt-l1">
    {props.title}
    </section>
    <section className="header-btns">
    <div className="btn-container">
    <div id="info-btn">
    <span onClick={renderInfoModal} className="fas fa-info-circle pointer"></span>
    </div>
    <img onClick={toggleAvatarMenu} id="avatar-img" src={props.avatar} alt="Profile Image Placeholder"></img>
    </div>
    <div id="avatar-menu">
    <h1 id="logout" onClick={gLogout}>Logout</h1>
    </div>
    </section>
    </div>
  );
};

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
};

/**
* gLogout() - Logs the current user out of the application via their google account.
*/
function gLogout() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    logout();
  });
};

/**
* logout() - Logs the current user out and redirects them to the '/'.
*/
async function logout() {
  const url = '/auth/logout';
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    redirect: 'follow'
  })
  window.location.href = '/';
};

// React Fragments
function ClassFragment(props) {
  return (
    <React.Fragment>
    <ClassesBC />
    <ArrowBC />
    <ClassElemBC href={props.hrefClass} name={props.className} />
    </React.Fragment>
  );
};
function AsgmtFragment(props) {
  return (
    <React.Fragment>
    <ClassesBC />
    <ArrowBC />
    <ClassElemBC href={props.hrefClass} name={props.className} />
    <ArrowBC />
    <AsgmtElemBC href={props.hrefAsgmt} name={props.asgmtName} />
    </React.Fragment>
  );
};

// JSX
function ClassesBC() {
  return (
    <li id="header-classes"><a href="/main/dashboard">Classes</a></li>
  );
};
function ClassElemBC(props) {
  return (
    <li id="header-class"><a href={props.href}>{props.name}</a></li>
  );
};
function AsgmtElemBC(props) {
  return (
    <li id="header-asgmt"><a href={props.href}>{props.name}</a></li>
  );
};
function ArrowBC() {
  return (
    <li id="header-arrow"><span class="fas fa-angle-right"></span></li>
  );
};
