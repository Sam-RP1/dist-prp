'use strict'; //------------- GLOBAL VARIABLES -------------//
// Dashboard UI Component Functions

async function dashboardContents() {
  // needs to get the correct data sent BackBtn
  const url = '/api/user/classes';
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const data = await response.json();
  let content;

  if (data.length < 1 && userTier === 1) {
    content = React.createElement("p", {
      className: "txt-l1 default-msg"
    }, "You do not have any classes at the moment.");
  } else if (data.length < 1 && userTier === 0) {
    content = React.createElement("p", {
      className: "txt-l1 default-msg"
    }, "You are not apart of any classes at the moment.");
  } else {
    content = React.createElement(DashboardContentGenerator, {
      classes: data
    });
  }

  ReactDOM.render(content, document.getElementById('page-content'));

  if (document.cookie.split(';').filter(item => item.includes('prpUILayout=1')).length) {
    document.getElementById('list-btn').click();
  }
}

;

function DashboardContentGenerator(props) {
  return React.createElement(React.Fragment, null, React.createElement(DashboardGridLayout, {
    classes: props.classes
  }), React.createElement(DashboardListLayout, {
    classes: props.classes
  }));
}

; //----- Used to construct and render the UI components

class DashboardGridLayout extends React.Component {
  // needs to be able to open the next page while maintaining the the entity that was requested to be opened
  constructor(props) {
    super(props);
    this.state = {
      classes: props.classes
    };
    this.openAlternateBtns = this.openAlternateBtns.bind(this);
    this.closeAlternateBtns = this.closeAlternateBtns.bind(this);
  }

  openAlternateBtns(a) {
    document.getElementById(a).style.left = '-100%';
  }

  closeAlternateBtns(b) {
    document.getElementById(b).style.left = '0%';
  }

  render() {
    let title1;
    let title2;
    let heading;

    if (userTier === 1) {
      title1 = "Students";
      title2 = "Join Code";
    } else {
      title1 = "Assignments";
      title2 = "Reviews";
      heading = React.createElement("p", {
        className: "cmpnt-details-title-g"
      }, "Work to do:");
    }

    return React.createElement("div", {
      id: "grid",
      className: "grid-layout"
    }, this.state.classes.map((name, i) => React.createElement("div", {
      key: i.toString(),
      className: ["cmpnt-container-g", "padding-0810", this.state.classes[i].ref].join(' ')
    }, React.createElement("section", {
      className: "cmpnt-info-g"
    }, React.createElement("div", {
      className: "cmpnt-heading-g"
    }, React.createElement("h1", null, this.state.classes[i].name), React.createElement("p", null, this.state.classes[i].unitCode)), React.createElement("div", {
      className: "cmpnt-details-container-g"
    }, heading, React.createElement("div", {
      className: "cmpnt-detail-wrapper-g"
    }, React.createElement("div", {
      className: "cmpnt-detail-block-g"
    }, React.createElement("p", null, title1), React.createElement("p", {
      className: "cmpnt-data-g"
    }, this.state.classes[i].value1)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("div", {
      className: "cmpnt-detail-block-g"
    }, React.createElement("p", null, title2), React.createElement("p", {
      className: "cmpnt-data-g"
    }, this.state.classes[i].value2))))), React.createElement("section", {
      className: "cmpnt-btn-container-g"
    }, React.createElement("div", {
      className: "default-btns-g"
    }, React.createElement("a", {
      href: "https://localhost/main/class?classId=" + this.state.classes[i].ref + "&className=" + this.state.classes[i].name,
      className: "cmpnt-btn-g"
    }, React.createElement("span", null, "Open Class")), React.createElement("span", {
      onClick: () => this.openAlternateBtns("altBtnsG-" + i),
      className: "fas fa-ellipsis-h cmpnt-options-btn"
    })), React.createElement("div", {
      id: "altBtnsG-" + i,
      className: "alternate-btns-g"
    }, React.createElement("span", {
      onClick: () => removeAction(this.state.classes[i].ref),
      className: "cmpnt-btn-g-50 alt-colour far fa-trash-alt"
    }), React.createElement("span", {
      onClick: () => hideClass(this.state.classes[i].ref),
      className: "cmpnt-btn-g-50 prime-colour far fa-eye-slash"
    }), React.createElement("span", {
      onClick: () => this.closeAlternateBtns("altBtnsG-" + i),
      className: "fas fa-times cmpnt-options-btn"
    }))))));
  }

}

;

class DashboardListLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props.classes
    };
    this.openAlternateBtns = this.openAlternateBtns.bind(this);
    this.closeAlternateBtns = this.closeAlternateBtns.bind(this);
  }

  openAlternateBtns(a) {
    document.getElementById(a).style.left = '-100%';
  }

  closeAlternateBtns(b) {
    document.getElementById(b).style.left = '0%';
  }

  render() {
    let title1;
    let title2;
    let heading;

    if (userTier === 1) {
      title1 = "Students";
      title2 = "Class Code";
    } else {
      title1 = "Assignments";
      title2 = "Reviews";
      heading = React.createElement("p", {
        className: "cmpnt-details-title-g"
      }, "Work to do:");
    }

    return React.createElement("div", {
      id: "list",
      className: "list-layout"
    }, this.state.classes.map((name, i) => React.createElement("div", {
      key: i.toString(),
      className: ["cmpnt-container-l", "padding-0810", this.state.classes[i].ref].join(' ')
    }, React.createElement("section", {
      className: "cmpnt-name"
    }, React.createElement("h1", null, this.state.classes[i].name)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-info-l"
    }, React.createElement("p", null, "Unit Code: ", this.state.classes[i].unitCode), React.createElement("p", null, title1, ": ", this.state.classes[i].value1), React.createElement("p", null, title2, ": ", this.state.classes[i].value2)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-btn-container-l"
    }, React.createElement("div", {
      className: "default-btns-l"
    }, React.createElement("a", {
      href: "https://localhost/main/class?classId=" + this.state.classes[i].ref + "&className=" + this.state.classes[i].name,
      className: "cmpnt-btn-l"
    }, React.createElement("span", null, React.createElement("p", null, "Open Class"))), React.createElement("span", {
      onClick: () => this.openAlternateBtns("altBtnsL-" + i),
      className: "fas fa-ellipsis-h cmpnt-options-btn"
    })), React.createElement("div", {
      id: "altBtnsL-" + i,
      className: "alternate-btns-l"
    }, React.createElement("span", {
      onClick: () => removeAction(this.state.classes[i].ref),
      className: "cmpnt-btn-l-50 alt-colour far fa-trash-alt"
    }), React.createElement("span", {
      onClick: () => hideClass(this.state.classes[i].ref),
      className: "cmpnt-btn-l-50 prime-colour far fa-eye-slash"
    }), React.createElement("span", {
      onClick: () => this.closeAlternateBtns("altBtnsL-" + i),
      className: "fas fa-times cmpnt-options-btn"
    }))))));
  }

}

; //----- Functions used to perform operations on UI components

async function removeAction(id) {
  let url;
  let msg;

  if (userTier === 1) {
    url = '/api/class/delete';
    msg = 'Are you sure you want to delete this class? All of its associated information will also be deleted permanently.';
  } else {
    url = '/api/class/leave';
    msg = 'Are you sure you want to leave this class? Leaving means you will not be able to finish any active outstanding assignments or reviews you have.';
  }

  if (window.confirm(msg)) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        id: id
      })
    });
    const data = await response.json();

    if (data.status === 'success') {
      ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
      await dashboardContents();
    }

    renderMessage(data);
  }
}

;

async function hideClass(id) {
  let elems = document.getElementsByClassName(id);

  for (let i = 0; i < elems.length; i++) {
    elems[i].style.display = "none";
  }

  const cookieName = "prpUserCookie";
  let cookieString = await getCookie(cookieName);

  if (cookieString.length === 0) {
    cookieString = id;
  } else {
    cookieString = cookieString + "," + id;
  }

  document.cookie = "prpUserCookie=" + cookieString + ";path=/";
  const response = await fetch('/api/user/cookie/data', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: cookieString
    })
  });
  const data = await response.json();
}

;