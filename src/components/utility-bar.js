'use strict'; //------------- GLOBAL VARIABLES -------------//
// Utility Bar UI Components

/**
* dashboardUtilityBar() - Loads and renders the dashboards utility bar component.
*/

async function dashboardUtilityBar() {
  let utilityBar;

  if (userTier === 1) {
    utilityBar = React.createElement(DashboardBar, {
      btn: React.createElement(CreateClassBtn, null),
      modal: renderCreateClassModal
    });
  } else {
    utilityBar = React.createElement(DashboardBar, {
      btn: React.createElement(JoinClassBtn, null),
      modal: renderJoinClassModal
    });
  }

  ReactDOM.render(utilityBar, document.getElementById('utility-bar'));
}

;
/**
* classUtilityBar() - Loads and renders the class pages utility bar component.
*/

async function classUtilityBar() {
  let utilityBar;

  if (userTier === 1) {
    utilityBar = React.createElement(TeacherClassBar, {
      modal1: renderClassDetailsModal,
      modal2: renderCreateAssignmentModal
    });
  } else {
    utilityBar = React.createElement(StudentClassBar, null);
  }

  ReactDOM.render(utilityBar, document.getElementById('utility-bar'));
}

;
/**
* assignmentBar() - Loads and renders the assginment pages utility bar component.
*/

async function assignmentBar() {
  let assignmentBar;

  if (userTier === 1) {
    assignmentBar = React.createElement(TeacherAssignmentBar, null);
  } else {
    assignmentBar = React.createElement(StudentAssignmentBar, null);
  }

  ReactDOM.render(assignmentBar, document.getElementById('assignment-bar'));
  const container = document.getElementById("asgmt-btns");
  const btns = container.getElementsByClassName("asgmt-bar-btn");

  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      let current = document.getElementsByClassName("asgmt-active");
      current[0].className = current[0].className.replace(" asgmt-active", "");
      this.className += " asgmt-active";
    });
  }
}

; // React Fragments
//----- Used to generate the utility bars

function DashboardBar(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    onClick: unhideClasses,
    id: "unhide-btn",
    className: "utility-bar-btn"
  }, React.createElement("span", {
    className: "far fa-eye"
  }), React.createElement(UnhideClassesBtn, null)), React.createElement("div", {
    onClick: props.modal,
    id: "plus-btn",
    className: "utility-bar-btn"
  }, React.createElement("span", {
    className: "fas fa-plus"
  }), props.btn), React.createElement(GridBtn, null), React.createElement(ListBtn, null));
}

;

function TeacherClassBar(props) {
  return React.createElement(React.Fragment, null, React.createElement(BackBtn, null), React.createElement("div", {
    onClick: props.modal1,
    id: "cog-btn",
    class: "utility-bar-btn"
  }, React.createElement("span", {
    className: "fas fa-cog"
  }), React.createElement("p", {
    className: "utility-bar-btn-txt"
  }, "Class Details")), React.createElement("div", {
    onClick: props.modal2,
    id: "plus-btn",
    className: "utility-bar-btn"
  }, React.createElement("span", {
    className: "fas fa-plus"
  }), React.createElement("p", {
    className: "utility-bar-btn-txt"
  }, "Create an asssignment")), React.createElement(GridBtn, null), React.createElement(ListBtn, null));
}

;

function StudentClassBar() {
  return React.createElement(React.Fragment, null, React.createElement(BackBtn, null), React.createElement(GridBtn, null), React.createElement(ListBtn, null));
}

;

function TeacherAssignmentBar() {
  return React.createElement(React.Fragment, null, React.createElement(BackBtn, null), React.createElement("div", {
    className: "asgmt-btn-container"
  }, React.createElement(SmallScreenMenu, null), React.createElement("div", {
    id: "asgmt-btns"
  }, React.createElement(AssignmentBtn, null), React.createElement(DetailsBtn, null), React.createElement(MetareviewBtn, null), React.createElement(ResultsBtn, null))));
}

;

function StudentAssignmentBar() {
  return React.createElement(React.Fragment, null, React.createElement(BackBtn, null), React.createElement("div", {
    className: "asgmt-btn-container"
  }, React.createElement(SmallScreenMenu, null), React.createElement("div", {
    id: "asgmt-btns"
  }, React.createElement(AssignmentBtn, null), React.createElement(SubmitBtn, null), React.createElement(ReviewBtn, null), React.createElement(FeedbackBtn, null))));
}

; // JSX Components
//----- Used in utility bars to dynamically create the UI element based on the user
//----- Dashboard Utility Bar

function UnhideClassesBtn() {
  return React.createElement("p", {
    className: "utility-bar-btn-txt"
  }, "Unhide Classes");
}

;

function CreateClassBtn() {
  return React.createElement("p", {
    className: "utility-bar-btn-txt"
  }, "Create a class");
}

;

function JoinClassBtn() {
  return React.createElement("p", {
    className: "utility-bar-btn-txt"
  }, "Join a class");
}

; //----- Assignment Utility Bar

function AssignmentBtn() {
  return React.createElement("div", {
    onClick: openAsgmt,
    id: "assignment-btn",
    className: "asgmt-bar-btn asgmt-active"
  }, React.createElement("p", {
    className: "asgmt-bar-btn-txt"
  }, "Assignment"));
}

;

function SubmitBtn() {
  return React.createElement("div", {
    onClick: openSubmit,
    id: "submit-btn",
    className: "asgmt-bar-btn"
  }, React.createElement("p", {
    className: "asgmt-bar-btn-txt"
  }, "Submit"));
}

;

function ReviewBtn() {
  return React.createElement("div", {
    onClick: openReviews,
    id: "reviewpeers-btn",
    className: "asgmt-bar-btn"
  }, React.createElement("p", {
    className: "asgmt-bar-btn-txt"
  }, "Review Peers"));
}

;

function FeedbackBtn() {
  return React.createElement("div", {
    onClick: openFeedback,
    id: "feedback-btn",
    className: "asgmt-bar-btn"
  }, React.createElement("p", {
    className: "asgmt-bar-btn-txt"
  }, "Feedback Recieved"));
}

;

function DetailsBtn() {
  return React.createElement("div", {
    onClick: openDetails,
    id: "details-btn",
    className: "asgmt-bar-btn"
  }, React.createElement("p", {
    className: "asgmt-bar-btn-txt"
  }, "Details"));
}

;

function MetareviewBtn() {
  return React.createElement("div", {
    onClick: openMetareview,
    id: "metareview-btn",
    className: "asgmt-bar-btn"
  }, React.createElement("p", {
    className: "asgmt-bar-btn-txt"
  }, "Meta-Review"));
}

;

function ResultsBtn() {
  return React.createElement("div", {
    onClick: openResults,
    id: "results-btn",
    className: "asgmt-bar-btn"
  }, React.createElement("p", {
    className: "asgmt-bar-btn-txt"
  }, "Results"));
}

;

function SmallScreenMenu() {
  return React.createElement("div", {
    onClick: toggleAsgmtMenu,
    id: "asgmt-menu-btn"
  }, React.createElement("div", {
    id: "bar-1"
  }), React.createElement("div", {
    id: "bar-2"
  }), React.createElement("div", {
    id: "bar-3"
  }));
}

; //----- Multi Use

function GridBtn() {
  return React.createElement("div", {
    id: "grid-btn",
    onClick: sortGrid,
    className: "grid-btn transform-02"
  }, React.createElement("span", {
    className: "fas fa-th-large"
  }));
}

;

function ListBtn() {
  return React.createElement("div", {
    id: "list-btn",
    onClick: sortList,
    className: "list-btn transform-02"
  }, React.createElement("span", {
    className: "fas fa-bars"
  }));
}

;

function BackBtn() {
  return React.createElement("div", {
    className: "utility-bar-back-btn"
  }, React.createElement("span", {
    onClick: goBack,
    className: "fas fa-chevron-left"
  }, React.createElement("p", {
    className: "utility-bar-back-btn-txt"
  }, "back")));
}

; // Utility Bar Binds
//----- Used to perform UI alterations

async function unhideClasses() {
  const cookieName = "prpUserCookie";
  const cookie = await getCookie(cookieName);
  let cookieArr = cookie.split(',');

  if (!cookieArr[0] == "") {
    for (let i = 0; i < cookieArr.length; i++) {
      const elems = document.getElementsByClassName(cookieArr[i]);
      elems[0].style.display = "flex";
      elems[1].style.display = "flex";
      console.log("Unhidden " + cookieArr[i]);
    }
  }

  document.cookie = "prpUserCookie=;path=/";
  const response = await fetch('/api/user/cookie/data', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: ""
    })
  });
  const data = await response.json();
  console.log(data);
}

function sortGrid() {
  const elems = document.getElementsByClassName('list-layout');

  for (let i = 0; i < elems.length; i++) {
    elems[i].style.display = 'none';
  }

  const altElems = document.getElementsByClassName('grid-layout');

  for (let i = 0; i < altElems.length; i++) {
    altElems[i].style.display = 'flex';
  }

  document.getElementById('grid-btn').style.color = '#000';
  document.getElementById('list-btn').style.color = '#444';
  document.cookie = "prpUILayout=0; path=/";
}

;

function sortList() {
  const elems = document.getElementsByClassName('grid-layout');

  for (let i = 0; i < elems.length; i++) {
    elems[i].style.display = 'none';
  }

  const altElems = document.getElementsByClassName('list-layout');

  for (let i = 0; i < altElems.length; i++) {
    altElems[i].style.display = 'flex';
  }

  document.getElementById('list-btn').style.color = '#000';
  document.getElementById('grid-btn').style.color = '#444';
  document.cookie = "prpUILayout=1; path=/";
}

;

function goBack() {
  window.history.back();
}

;

function toggleAsgmtMenu() {
  const btns = document.getElementById('asgmt-btns');

  if (btns.style.top === '0px') {
    btns.style.top = '-250px';
  } else {
    btns.style.top = '0px';
  }

  document.getElementById('asgmt-menu-btn').classList.toggle("change");
} //----- Functions used to perform operations on UI components


function openAsgmt() {
  if (!document.getElementById('details-box')) {
    document.getElementById('submit-box').style.display = "none";
    document.getElementById('review-box').style.display = "none";
    document.getElementById('feedback-box').style.display = "none";
  } else {
    document.getElementById('details-box').style.display = "none";
    document.getElementById('meta-review-box').style.display = "none";
    document.getElementById('results-box').style.display = "none";
  }

  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('asgmt-box').style.display = "flex";
}

;

function openDetails() {
  document.getElementById('meta-review-box').style.display = "none";
  document.getElementById('results-box').style.display = "none";
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('details-box').style.display = "flex";
}

;

function openMetareview() {
  document.getElementById('results-box').style.display = "none";
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('details-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('meta-review-box').style.display = "flex";
}

;

function openResults() {
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('details-box').style.display = "none";
  document.getElementById('meta-review-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('results-box').style.display = "flex";
}

;

function openSubmit() {
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('review-box').style.display = "none";
  document.getElementById('feedback-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('submit-box').style.display = "flex";
}

function openReviews() {
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('submit-box').style.display = "none";
  document.getElementById('feedback-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('review-box').style.display = "flex";
}

;

function openFeedback() {
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('submit-box').style.display = "none";
  document.getElementById('review-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('feedback-box').style.display = "flex";
}

;

function loadReview() {
  if (!document.getElementById('details-box')) {
    document.getElementById('submit-box').style.display = "none";
    document.getElementById('review-box').style.display = "none";
    document.getElementById('feedback-box').style.display = "none";
  } else {
    document.getElementById('details-box').style.display = "none";
    document.getElementById('meta-review-box').style.display = "none";
    document.getElementById('results-box').style.display = "none";
  }

  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "flex";
}

function closeReview() {
  if (!document.getElementById('details-box')) {
    document.getElementById('submit-box').style.display = "none";
    document.getElementById('review-box').style.display = "flex";
    document.getElementById('feedback-box').style.display = "none";
  } else {
    document.getElementById('details-box').style.display = "none";
    document.getElementById('meta-review-box').style.display = "flex";
    document.getElementById('results-box').style.display = "none";
  }

  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
} // ???


function AssignmentBar(props) {
  return React.createElement(React.Fragment, null, props.assignmentbtn, props.submitBtn, props.reviewsBtn, props.resultsBtn);
}

;