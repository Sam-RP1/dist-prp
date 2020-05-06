'use strict';

//------------- GLOBAL VARIABLES -------------//

// Utility Bar UI Components
/**
* dashboardUtilityBar() - Loads and renders the dashboards utility bar component.
*/
async function dashboardUtilityBar() {
  let utilityBar;

  if (userTier === 1) {
    utilityBar = <DashboardBar btn=<CreateClassBtn /> modal={renderCreateClassModal} />
  } else {
    utilityBar = <DashboardBar btn=<JoinClassBtn /> modal={renderJoinClassModal} />
  }

  ReactDOM.render(
    utilityBar,
    document.getElementById('utility-bar')
  );
};

/**
* classUtilityBar() - Loads and renders the class pages utility bar component.
*/
async function classUtilityBar() {
  let utilityBar;

  if (userTier === 1) {
    utilityBar = <TeacherClassBar modal1={renderClassDetailsModal} modal2={renderCreateAssignmentModal} />
  } else {
    utilityBar = <StudentClassBar />
  }

  ReactDOM.render(
    utilityBar,
    document.getElementById('utility-bar')
  );
};

/**
* assignmentBar() - Loads and renders the assginment pages utility bar component.
*/
async function assignmentBar() {
  let assignmentBar;

  if (userTier === 1) {
    assignmentBar = <TeacherAssignmentBar />
  } else {
    assignmentBar = <StudentAssignmentBar />
  }

  ReactDOM.render(
    assignmentBar,
    document.getElementById('assignment-bar')
  );
  const container = document.getElementById("asgmt-btns");
  const btns = container.getElementsByClassName("asgmt-bar-btn");
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      let current = document.getElementsByClassName("asgmt-active");
      current[0].className = current[0].className.replace(" asgmt-active", "");
      this.className += " asgmt-active";
    });
  }
};

// React Fragments
//----- Used to generate the utility bars
function DashboardBar(props) {
  return (
    <React.Fragment>
    <div onClick={unhideClasses} id="unhide-btn" className="utility-bar-btn">
    <span className="far fa-eye"></span>
    <UnhideClassesBtn />
    </div>
    <div onClick={props.modal} id="plus-btn" className="utility-bar-btn">
    <span className="fas fa-plus"></span>
    {props.btn}
    </div>
    <GridBtn />
    <ListBtn />
    </React.Fragment>
  );
};
function TeacherClassBar(props) {
  return (
    <React.Fragment>
    <BackBtn />
    <div onClick={props.modal1} id="cog-btn" class="utility-bar-btn">
    <span className="fas fa-cog"></span>
    <p className="utility-bar-btn-txt">Class Details</p>
    </div>
    <div onClick={props.modal2} id="plus-btn" className="utility-bar-btn">
    <span className="fas fa-plus"></span>
    <p className="utility-bar-btn-txt">Create an assignment</p>
    </div>
    <GridBtn />
    <ListBtn />
    </React.Fragment>
  );
};
function StudentClassBar() {
  return (
    <React.Fragment>
    <BackBtn />
    <GridBtn />
    <ListBtn />
    </React.Fragment>
  );
};
function TeacherAssignmentBar() {
  return (
    <React.Fragment>
    <BackBtn />
    <div className="asgmt-btn-container">
    <SmallScreenMenu />
    <div id="asgmt-btns">
    <AssignmentBtn />
    <DetailsBtn />
    <MetareviewBtn />
    <ResultsBtn />
    </div>
    </div>
    </React.Fragment>
  );
};
function StudentAssignmentBar() {
  return (
    <React.Fragment>
    <BackBtn />
    <div className="asgmt-btn-container">
    <SmallScreenMenu />
    <div id="asgmt-btns">
    <AssignmentBtn />
    <SubmitBtn />
    <ReviewBtn />
    <FeedbackBtn />
    </div>
    </div>
    </React.Fragment>
  );
};

// JSX Components
//----- Used in utility bars to dynamically create the UI element based on the user
//----- Dashboard Utility Bar
function UnhideClassesBtn() {
  return (
    <p className="utility-bar-btn-txt">Unhide Classes</p>
  );
};
function CreateClassBtn() {
  return (
    <p className="utility-bar-btn-txt">Create a class</p>
  );
};
function JoinClassBtn() {
  return (
    <p className="utility-bar-btn-txt">Join a class</p>
  );
};
//----- Assignment Utility Bar
function AssignmentBtn() {
  return (
    <div onClick={openAsgmt} id="assignment-btn" className="asgmt-bar-btn asgmt-active">
    <p className="asgmt-bar-btn-txt">Assignment</p>
    </div>
  );
};
function SubmitBtn() {
  return (
    <div onClick={openSubmit} id="submit-btn" className="asgmt-bar-btn">
    <p className="asgmt-bar-btn-txt">Submit</p>
    </div>
  );
};
function ReviewBtn() {
  return (
    <div onClick={openReviews} id="reviewpeers-btn" className="asgmt-bar-btn">
    <p className="asgmt-bar-btn-txt">Review Peers</p>
    </div>
  );
};
function FeedbackBtn() {
  return (
    <div onClick={openFeedback} id="feedback-btn" className="asgmt-bar-btn">
    <p className="asgmt-bar-btn-txt">Feedback Recieved</p>
    </div>
  );
};
function DetailsBtn() {
  return (
    <div onClick={openDetails} id="details-btn" className="asgmt-bar-btn">
    <p className="asgmt-bar-btn-txt">Details</p>
    </div>
  );
};
function MetareviewBtn() {
  return (
    <div onClick={openMetareview} id="metareview-btn" className="asgmt-bar-btn">
    <p className="asgmt-bar-btn-txt">Meta-Review</p>
    </div>
  );
};
function ResultsBtn() {
  return (
    <div onClick={openResults} id="results-btn" className="asgmt-bar-btn">
    <p className="asgmt-bar-btn-txt">Results</p>
    </div>
  );
};
function SmallScreenMenu() {
  return (
    <div onClick={toggleAsgmtMenu} id="asgmt-menu-btn">
    <div id="bar-1"></div>
    <div id="bar-2"></div>
    <div id="bar-3"></div>
    </div>
  );
};
//----- Multi Use
function GridBtn() {
  return (
    <div id="grid-btn" onClick={sortGrid} className="grid-btn transform-02">
    <span className="fas fa-th-large"></span>
    </div>
  );
};
function ListBtn() {
  return (
    <div id="list-btn" onClick={sortList} className="list-btn transform-02">
    <span className="fas fa-bars"></span>
    </div>
  );
};
function BackBtn() {
  return (
    <div className="utility-bar-back-btn">
    <span onClick={goBack} className="fas fa-chevron-left"><p className="utility-bar-back-btn-txt">back</p></span>
    </div>
  );
};

// Utility Bar Binds
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
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({
      data: ""
    })
  });
  const data = await response.json();
  console.log(data)
}
function sortGrid() {
  const elems = document.getElementsByClassName('list-layout');
  for (let i=0; i < elems.length; i++) {
    elems[i].style.display = 'none';
  }
  const altElems = document.getElementsByClassName('grid-layout');
  for (let i=0; i < altElems.length; i++) {
    altElems[i].style.display = 'flex';
  }
  document.getElementById('grid-btn').style.color = '#000';
  document.getElementById('list-btn').style.color = '#444';
  document.cookie = "prpUILayout=0; path=/";
};
function sortList() {
  const elems = document.getElementsByClassName('grid-layout');
  for (let i=0; i < elems.length; i++) {
    elems[i].style.display = 'none';
  }
  const altElems = document.getElementsByClassName('list-layout');
  for (let i=0; i < altElems.length; i++) {
    altElems[i].style.display = 'flex';
  }
  document.getElementById('list-btn').style.color = '#000';
  document.getElementById('grid-btn').style.color = '#444';
  document.cookie = "prpUILayout=1; path=/";
};
function goBack() {
  window.history.back();
};
function toggleAsgmtMenu() {
  const btns = document.getElementById('asgmt-btns');
  if (btns.style.top === '0px') {
    btns.style.top = '-250px';
  } else {
    btns.style.top = '0px';
  }
  document.getElementById('asgmt-menu-btn').classList.toggle("change");
}

//----- Functions used to perform operations on UI components
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
};
function openDetails() {
  document.getElementById('meta-review-box').style.display = "none";
  document.getElementById('results-box').style.display = "none";
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('details-box').style.display = "flex";
};
function openMetareview() {
  document.getElementById('results-box').style.display = "none";
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('details-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('meta-review-box').style.display = "flex";
};
function openResults() {
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('details-box').style.display = "none";
  document.getElementById('meta-review-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('results-box').style.display = "flex";
};
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
};
function openFeedback() {
  document.getElementById('asgmt-box').style.display = "none";
  document.getElementById('submit-box').style.display = "none";
  document.getElementById('review-box').style.display = "none";
  document.getElementById('reviewing-box').style.display = "none";
  document.getElementById('feedback-box').style.display = "flex";
};
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
}
function AssignmentBar(props) {
  return (
    <React.Fragment>
    {props.assignmentbtn}
    {props.submitBtn}
    {props.reviewsBtn}
    {props.resultsBtn}
    </React.Fragment>
  );
};
