'use strict'; //------------- GLOBAL VARIABLES -------------//

let classDetails; // Class UI Component Functions

async function getClassContents() {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('classId');
  const className = urlParams.get('className');
  const url = '/api/class/assignments?classId=' + classId;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const data = await response.json();
  let activeAsgmt = [];
  let pastAsgmt = [];

  if (userTier === 1) {
    const url = '/api/class/details?classId=' + classId;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const classData = await response.json();
    classDetails = classData.status === 'success' ? classData.classDetails : classData.msg;

    for (let i = 0; i < data.length; i++) {
      data[i].workSubmitted = data[i].workSubmitted + " / " + data[i].classSize;
      data[i].reviewsCompleted = data[i].reviewsCompleted + " / " + data[i].classSize;
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      if (data[i].workSubmitted === 1) {
        data[i].workSubmitted = React.createElement(TickElement, null);
      } else {
        data[i].workSubmitted = React.createElement(CrossElement, null);
      }

      if (data[i].reviewsCompleted === 1) {
        data[i].reviewsCompleted = React.createElement(TickElement, null);
      } else {
        data[i].reviewsCompleted = React.createElement(CrossElement, null);
      }
    }
  } // Maybe move to server


  const today = new Date();
  const currentDateISO = today.toISOString();

  for (let i = 0; i < data.length; i++) {
    if (data[i].dueDateReviews < currentDateISO) {
      data[i].dueDateSubmissions = data[i].dueDateSubmissions.slice(0, 10);
      data[i].dueDateSubmissions = data[i].dueDateSubmissions.split("-").reverse().join("-");
      data[i].dueDateReviews = data[i].dueDateReviews.slice(0, 10);
      data[i].dueDateReviews = data[i].dueDateReviews.split("-").reverse().join("-");
      pastAsgmt.push(data[i]);
    } else {
      data[i].dueDateSubmissions = data[i].dueDateSubmissions.slice(0, 10);
      data[i].dueDateSubmissions = data[i].dueDateSubmissions.split("-").reverse().join("-");
      data[i].dueDateReviews = data[i].dueDateReviews.slice(0, 10);
      data[i].dueDateReviews = data[i].dueDateReviews.split("-").reverse().join("-");
      activeAsgmt.push(data[i]);
    }
  }

  const content = React.createElement(ClassContentGenerator, {
    className: className,
    activeAsgmt: activeAsgmt,
    pastAsgmt: pastAsgmt
  });
  ReactDOM.render(content, document.getElementById('page-content'));

  if (document.cookie.split(';').filter(item => item.includes('prpUILayout=1')).length) {
    document.getElementById('list-btn').click();
  }
}

;

function ClassContentGenerator(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "asgmt-title"
  }, React.createElement("h2", null, "Active Assignments")), React.createElement(ClassGridLayout, {
    className: props.className,
    assignments: props.activeAsgmt
  }), React.createElement(ClassListLayout, {
    className: props.className,
    assignments: props.activeAsgmt
  }), React.createElement("div", {
    className: "asgmt-title"
  }, React.createElement("h2", null, "Past Assignments")), React.createElement(ClassGridLayout, {
    className: props.className,
    assignments: props.pastAsgmt
  }), React.createElement(ClassListLayout, {
    className: props.className,
    assignments: props.pastAsgmt
  }));
}

; //----- Used to construct and render the UI components

class ClassGridLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: props.assignments,
      class: {
        name: props.className
      }
    };
  }

  render() {
    return React.createElement("div", {
      id: "grid",
      className: "grid-layout"
    }, this.state.assignments.map((name, i) => React.createElement("div", {
      key: i.toString(),
      className: "cmpnt-container-g padding-0810"
    }, React.createElement("section", {
      className: "cmpnt-info-g"
    }, React.createElement("div", {
      className: "cmpnt-heading-g"
    }, React.createElement("h1", null, this.state.assignments[i].title)), React.createElement("div", {
      className: "cmpnt-details-container-g"
    }, React.createElement("div", {
      className: "cmpnt-detail-wrapper-g"
    }, React.createElement("div", {
      className: "cmpnt-detail-block-g"
    }, React.createElement("p", null, "Work Due"), React.createElement("p", {
      className: "cmpnt-data-g-50"
    }, this.state.assignments[i].dueDateSubmissions)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("div", {
      className: "cmpnt-detail-block-g"
    }, React.createElement("p", null, "Submitted"), React.createElement("p", {
      className: "cmpnt-data-g-50"
    }, this.state.assignments[i].workSubmitted)))), React.createElement("div", {
      className: "cmpnt-details-container-g"
    }, React.createElement("div", {
      className: "cmpnt-detail-wrapper-g"
    }, React.createElement("div", {
      className: "cmpnt-detail-block-g"
    }, React.createElement("p", null, "Reviews Due"), React.createElement("p", {
      className: "cmpnt-data-g-50"
    }, this.state.assignments[i].dueDateReviews)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("div", {
      className: "cmpnt-detail-block-g"
    }, React.createElement("p", null, "Completed"), React.createElement("p", {
      className: "cmpnt-data-g-50"
    }, this.state.assignments[i].reviewsCompleted))))), React.createElement("section", {
      className: "cmpnt-btn-container-g"
    }, React.createElement("div", {
      className: "default-btns-g"
    }, React.createElement("a", {
      href: "https://localhost/main/assignment?classId=" + this.state.assignments[i].cl_id + "&className=" + this.state.class.name + "&asgmtId=" + this.state.assignments[i].id + "&asgmtName=" + this.state.assignments[i].title,
      className: "cmpnt-btn-g-100"
    }, React.createElement("span", null, "Open")))))));
  }

}

;

class ClassListLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: props.assignments,
      class: {
        name: props.className
      }
    };
  }

  render() {
    return React.createElement("div", {
      id: "list",
      className: "list-layout"
    }, this.state.assignments.map((name, i) => React.createElement("div", {
      key: i.toString(),
      className: "cmpnt-container-l padding-0810"
    }, React.createElement("section", {
      className: "cmpnt-name"
    }, React.createElement("h1", null, this.state.assignments[i].title)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-info-l"
    }, React.createElement("p", null, "Work Due: ", this.state.assignments[i].dueDateSubmissions), React.createElement("p", null, "Submitted: ", this.state.assignments[i].workSubmitted), React.createElement("p", null, "Reviews Due: ", this.state.assignments[i].dueDateReviews), React.createElement("p", null, "Completed: ", this.state.assignments[i].reviewsCompleted)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-btn-container-l"
    }, React.createElement("div", {
      className: "default-btns-l"
    }, React.createElement("a", {
      href: "https://localhost/main/assignment?classId=" + this.state.assignments[i].cl_id + "&className=" + this.state.class.name + "&asgmtId=" + this.state.assignments[i].id + "&asgmtName=" + this.state.assignments[i].title,
      className: "cmpnt-btn-l"
    }, React.createElement("span", null, React.createElement("p", null, "Open"))))))));
  }

}

; //----- JSX used to alter UI components

function TickElement() {
  return React.createElement("span", {
    className: "far fa-check-circle"
  });
}

;

function CrossElement() {
  return React.createElement("span", {
    className: "far fa-times-circle"
  });
}

;