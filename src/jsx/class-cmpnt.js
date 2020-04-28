'use strict';

//------------- GLOBAL VARIABLES -------------//
let classDetails;

// Class UI Component Functions
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
    classDetails = (classData.status === 'success') ? classData.classDetails : classData.msg;
    for (let i=0; i < data.length; i++) {
      data[i].workSubmitted = data[i].workSubmitted + " / " + data[i].classSize;
      data[i].reviewsCompleted = data[i].reviewsCompleted + " / " + data[i].classSize;
    }
  } else {
    for (let i=0; i < data.length; i++) {
      if (data[i].workSubmitted === 1) {
        data[i].workSubmitted = <TickElement />
      } else {
        data[i].workSubmitted = <CrossElement />
      }
      if (data[i].reviewsCompleted === 1) {
        data[i].reviewsCompleted = <TickElement />
      } else {
        data[i].reviewsCompleted = <CrossElement />
      }
    }
  }

  // Maybe move to server
  const today = new Date();
  const currentDateISO = today.toISOString();

  for (let i=0; i < data.length; i++) {
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

  const content = <ClassContentGenerator className={className} activeAsgmt={activeAsgmt} pastAsgmt={pastAsgmt} />;

  ReactDOM.render(
    content,
    document.getElementById('page-content')
  );
  if (document.cookie.split(';').filter((item) => item.includes('prpUILayout=1')).length) {
    document.getElementById('list-btn').click();
  }
};
function ClassContentGenerator(props) {
  return (
    <React.Fragment>
    <div className="asgmt-title">
    <h2>Active Assignments</h2>
    </div>
    <ClassGridLayout className={props.className} assignments={props.activeAsgmt} />
    <ClassListLayout className={props.className} assignments={props.activeAsgmt} />
    <div className="asgmt-title">
    <h2>Past Assignments</h2>
    </div>
    <ClassGridLayout className={props.className} assignments={props.pastAsgmt} />
    <ClassListLayout className={props.className} assignments={props.pastAsgmt} />
    </React.Fragment>
  );
};

//----- Used to construct and render the UI components
class ClassGridLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: props.assignments,
      class: {
        name: props.className,
      }
    };
  }

  render () {
    return (
      <div id="grid" className="grid-layout">
      {this.state.assignments.map((name, i) =>
        <div key={i.toString()} className="cmpnt-container-g padding-0810">
        <section className="cmpnt-info-g">
        <div className="cmpnt-heading-g">
        <h1>{this.state.assignments[i].title}</h1>
        </div>
        <div className="cmpnt-details-container-g">
        <div className="cmpnt-detail-wrapper-g">
        <div className="cmpnt-detail-block-g">
        <p>Work Due</p>
        <p className="cmpnt-data-g-50">{this.state.assignments[i].dueDateSubmissions}</p>
        </div>
        <div className="cmpnt-seperator"></div>
        <div className="cmpnt-detail-block-g">
        <p>Submitted</p>
        <p className="cmpnt-data-g-50">{this.state.assignments[i].workSubmitted}</p>
        </div>
        </div>
        </div>
        <div className="cmpnt-details-container-g">
        <div className="cmpnt-detail-wrapper-g">
        <div className="cmpnt-detail-block-g">
        <p>Reviews Due</p>
        <p className="cmpnt-data-g-50">{this.state.assignments[i].dueDateReviews}</p>
        </div>
        <div className="cmpnt-seperator"></div>
        <div className="cmpnt-detail-block-g">
        <p>Completed</p>
        <p className="cmpnt-data-g-50">{this.state.assignments[i].reviewsCompleted}</p>
        </div>
        </div>
        </div>
        </section>
        <section className="cmpnt-btn-container-g">
        <div className="default-btns-g">
        <a href={"https://peerreviewportal.co.uk/main/assignment?classId=" + this.state.assignments[i].cl_id + "&className=" + this.state.class.name + "&asgmtId=" + this.state.assignments[i].id + "&asgmtName=" + this.state.assignments[i].title} className="cmpnt-btn-g-100">
        <span>Open</span>
        </a>
        </div>
        </section>
        </div>
      )}
      </div>
    );
  }
};
class ClassListLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: props.assignments,
      class: {
        name: props.className,
      }
    };
  }

  render () {
    return (
      <div id="list" className="list-layout">
      {this.state.assignments.map((name, i) =>
        <div key={i.toString()} className="cmpnt-container-l padding-0810">
        <section className="cmpnt-name">
        <h1>{this.state.assignments[i].title}</h1>
        </section>
        <div className="cmpnt-seperator"></div>
        <section className="cmpnt-info-l">
        <p>Work Due: {this.state.assignments[i].dueDateSubmissions}</p>
        <p>Submitted: {this.state.assignments[i].workSubmitted}</p>
        <p>Reviews Due: {this.state.assignments[i].dueDateReviews}</p>
        <p>Completed: {this.state.assignments[i].reviewsCompleted}</p>
        </section>
        <div className="cmpnt-seperator"></div>
        <section className="cmpnt-btn-container-l">
        <div className="default-btns-l">
        <a href={"https://peerreviewportal.co.uk/main/assignment?classId=" + this.state.assignments[i].cl_id + "&className=" + this.state.class.name + "&asgmtId=" + this.state.assignments[i].id + "&asgmtName=" + this.state.assignments[i].title} className="cmpnt-btn-l">
        <span><p>Open</p></span>
        </a>
        </div>
        </section>
        </div>
      )}
      </div>
    );
  }
};

//----- JSX used to alter UI components
function TickElement() {
  return (
    <span className="far fa-check-circle"></span>
  );
};
function CrossElement() {
  return (
    <span className="far fa-times-circle"></span>
  );
};
