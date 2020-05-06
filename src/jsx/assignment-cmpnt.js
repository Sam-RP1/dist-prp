'use strict';

//------------- GLOBAL VARIABLES -------------//

// Assignment UI Component Functions
async function getAssignmentContents() {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('classId');
  const asgmtId = urlParams.get('asgmtId');
  let attachments;
  // Get the users tier
  const tierResponse = await fetch('/api/user/tier', {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const uTier = await tierResponse.json();

  // Get the assignment
  const url = '/api/assignment?classId=' + classId + '&asgmtId=' + asgmtId;
  const asgmtResponse = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const asgmtData = await asgmtResponse.json();

  // Create the file attchment elements
  if (asgmtData[0].fileThree !== null) {
    attachments = (
      <div>
      <form method="GET" action={"/api/assignment/download/" + asgmtData[0].fileOne}><button type="submit" className="download-btn transition-01">File 1: {asgmtData[0].fileOne.split('/')}</button></form>
      <form method="GET" action={"/api/assignment/download/" + asgmtData[0].fileTwo}><button type="submit" className="download-btn transition-01">File 2: {asgmtData[0].fileTwo.split('/')}</button></form>
      <form method="GET" action={"/api/assignment/download/" + asgmtData[0].fileThree}><button type="submit" className="download-btn transition-01">File 3: {asgmtData[0].fileThree.split('/')}</button></form>
      </div>
    );
  } else if (asgmtData[0].fileTwo !== null) {
    attachments = (
      <div>
      <form method="GET" action={"/api/assignment/download/" + asgmtData[0].fileOne}><button type="submit" className="download-btn transition-01">File 1: {asgmtData[0].fileOne.split('/')}</button></form>
      <form method="GET" action={"/api/assignment/download/" + asgmtData[0].fileTwo}><button type="submit" className="download-btn transition-01">File 2: {asgmtData[0].fileTwo.split('/')}</button></form>
      </div>
    );
  } else if (asgmtData[0].fileOne !== null) {
    attachments = (
      <div>
      <form method="GET" action={"/api/assignment/download/" + asgmtData[0].fileOne}><button type="submit" className="download-btn transition-01">File 1: {asgmtData[0].fileOne.split('/')}</button></form>
      </div>
    );
  } else {
    attachments = "No files, please contact the teacher of this class."
  }

  if (uTier === 1) {
    const url = '/api/assignment/details?classId=' + classId + '&asgmtId=' + asgmtId;
    const detailsResponse = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const detailsData = await detailsResponse.json();

    const reviews = await fetch(('/api/assignment/reviews?classId=' + classId + '&asgmtId=' + asgmtId), {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const reviewData = await reviews.json();

    const results = await fetch(('/api/assignment/results?classId=' + classId + '&asgmtId=' + asgmtId), {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    })
    const resultsData = await results.json();

    const content = <AsgmtContentGenerator tier={uTier} title={asgmtData[0].title} description={asgmtData[0].description} workDueDate={asgmtData[0].dueDateSubmissions}
    reviewsDueDate={asgmtData[0].dueDateReviews} numReviews={asgmtData[0].numReviews} attachments={attachments}
    res1={asgmtData[0].resourceOne} res2={asgmtData[0].resourceTwo} res3={asgmtData[0].resourceThree} deadlineCounter={"placeholder"}
    classSize={detailsData.classSize} numSubmissionsCompleted={detailsData.numSubmissions} numReviewsCompleted={detailsData.numReviews}
    studentData={detailsData.studentData} reviewData={reviewData} resultsData={resultsData} />;
    ReactDOM.render(
      content,
      document.getElementById('page-content')
    );
  } else {
    // Get users submission status and data
    const submissionStatus = await fetch(('/api/assignment/submission/status?classId=' + classId + '&asgmtId=' + asgmtId), {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const submissionFile = await submissionStatus.text();
    // Get reviews assigned to user if any
    const reviews = await fetch(('/api/assignment/reviews?classId=' + classId + '&asgmtId=' + asgmtId), {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const reviewData = await reviews.json();

    const feedback = await fetch(('/api/assignment/feedback?classId=' + classId + '&asgmtId=' + asgmtId), {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const feedbackData = await feedback.json();
    console.log("FEEEDBACKKKK")
    console.log(feedbackData)
    const content = <AsgmtContentGenerator tier={uTier} title={asgmtData[0].title} description={asgmtData[0].description} workDueDate={asgmtData[0].dueDateSubmissions}
    reviewsDueDate={asgmtData[0].dueDateReviews} numReviews={asgmtData[0].numReviews} attachments={attachments}
    res1={asgmtData[0].resourceOne} res2={asgmtData[0].resourceTwo} res3={asgmtData[0].resourceThree} currentSubmission={submissionFile} reviewData={reviewData} feedbackData={feedbackData} />;
    ReactDOM.render(
      content,
      document.getElementById('page-content')
    );
    if (submissionFile !== '') {
      document.getElementById('current-submission').style.display = "flex";
    }
  }
};
function AsgmtContentGenerator(props) {
  if (props.tier === 1) {
    return (
      <React.Fragment>
      <AsgmtContainer title={props.title} description={props.description} workDueDate={props.workDueDate} reviewsDueDate={props.reviewsDueDate}
      numReviews={props.numReviews} attachments={props.attachments} file1={props.file1} file2={props.file2} file3={props.file3} res1={props.res1} res2={props.res2} res3={props.res3} />
      <DetailsContainer classSize={props.classSize} numSubmissionsCompleted={props.numSubmissionsCompleted} numReviewsCompleted={props.numReviewsCompleted} numReviewsToDo={props.numReviews}
      deadlineCounter={props.deadlineCounter} studentData={props.studentData} criteriaForm={props.resultsData.criteriaForm} />
      <MetareviewContainer reviewData={props.reviewData} />
      <ResultsContainer resultsData={props.resultsData} />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
      <AsgmtContainer title={props.title} description={props.description} workDueDate={props.workDueDate} reviewsDueDate={props.reviewsDueDate}
      numReviews={props.numReviews} attachments={props.attachments} file1={props.file1} file2={props.file2} file3={props.file3} res1={props.res1} res2={props.res2} res3={props.res3} />
      <SubmitContainer currentSubmission={props.currentSubmission} />
      <ReviewContainer reviewData={props.reviewData} />
      <FeedbackContainer feedbackData={props.feedbackData} />
      </React.Fragment>
    )
  }
};

//----- Used to construct and render the UI components
// All users
function AsgmtContainer(props) {
  return (
    <div id="asgmt-box" className="assignment-container">
    <h1 id="asgmt-title" className="">{props.title}</h1>
    <p className="asgmt-description">{props.description}</p>
    <h2 id="details-title">Details -</h2>
    <p>Work Due: {props.workDueDate}</p>
    <p>Reviews Due: {props.reviewsDueDate}</p>
    <p>Peer Reviews Set: {props.numReviews}</p>
    <h2 id="attached-files-title">Attached Files -</h2>
    {props.attachments}
    <h2 id="resources-title">Useful Resources -</h2>
    <p>Resource 1: {props.res1}</p>
    <p>Resource 2: {props.res2}</p>
    <p>Resource 3: {props.res3}</p>
    </div>
  )
};
class DetailsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classSize: props.classSize,
      numSubmissions: props.numSubmissionsCompleted,
      numReviews: props.numReviewsCompleted,
      deadlineCounter: props.deadlineCounter,
      numReviewsToDo: props.numReviewsToDo,
      studentData: props.studentData,
      criteriaForm: props.criteriaForm
    }
  }

  render () {
    return (
      <div id="details-box" className="details-container">
      <div className="asgmt-title">
      <h2>Overview</h2>
      </div>
      <div className="cmpnt-container-l asgmt-cmpnt-container-l padding-0810">
      <section className="cmpnt-info-l">
      <p>Total Submissions: {this.state.numSubmissions} / {this.state.classSize}</p>
      </section>
      <div className="cmpnt-seperator"></div>
      <section className="cmpnt-info-l">
      <p>Total Reviews: {this.state.numReviews} / {this.state.classSize}</p>
      </section>
      <div className="cmpnt-seperator"></div>
      <section className="cmpnt-info-l">
      <p>Time Till Deadline: {this.state.deadlineCounter}</p>
      </section>
      </div>
      <div className="asgmt-title">
      <h2>Students</h2>
      </div>
      {this.state.studentData.map((userId, i) =>
        <div key={i.toString()} className="cmpnt-container-l padding-0810">
        <section className="cmpnt-name">
        <h1>{this.state.studentData[i].name}</h1>
        </section>
        <div className="cmpnt-seperator"></div>
        <section className="cmpnt-info-l">
        <p>Submitted: {this.state.studentData[i].submissionCompleted} / 1</p>
        <p>Reviews Completed: {this.state.studentData[i].reviewsCompleted} / {this.state.studentData[i].reviewsAssigned}</p>
        </section>
        <div className="cmpnt-seperator"></div>
        <section className="cmpnt-btn-container-l">
        <div className="default-btns-l">
        <a onClick={() => renderSubmission(this.state.studentData[i].submissionURI, this.state.studentData[i].name)} className="cmpnt-btn-l asgmt-cmpnt-btn-l addon-m-10w">
        <p>View Submission</p>
        </a>
        <a onClick={() => renderFeedbackGiven(this.state.studentData[i].userId, this.state.studentData[i].name, this.state.criteriaForm)} className="cmpnt-btn-l asgmt-cmpnt-btn-l addon-m-10w">
        <p>View Reviews</p>
        </a>
        </div>
        </section>
        </div>
      )}
      </div>
    )
  }
};
class ReviewingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewerId: props.reviewerId,
      submitorId: props.submitorId,
      submissionURI: props.submissionURI,
      criteria: props.criteria,
      data: props.data,
      code: []
    }

    this.selectBoundary = this.selectBoundary.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  async selectBoundary(criteriaNum, boundaryId) {
    console.log(criteriaNum, boundaryId)
    // Get parent element
    const parentElem = document.getElementById("boundaries-" + criteriaNum);
    // Get the old selected boundary's id
    const oldElemId = this.state.data[criteriaNum-1].boundary;
    if (oldElemId !== undefined && oldElemId !== null) {
      const oldElem = parentElem.children[oldElemId-1];
      oldElem.style.color = "#000";
      oldElem.style.backgroundColor = "#fff";
    }
    // Set the new selected boundry
    this.state.data[criteriaNum-1].boundary = boundaryId;
    const newElem = parentElem.children[boundaryId-1];
    newElem.style.color = "#fff";
    newElem.style.backgroundColor = "#1478fa";
  }

  async changeHandler(event) {
    if (event.target.name === 'marksGiven') {
      if (parseInt(event.target.value) > event.target.max) {
        event.target.value = event.target.max;
      } else if (event.target.value < 0) {
        event.target.value = 0;
      }
    }
    let data = [...this.state.data];
    data[event.target.dataset.criterianum][event.target.name] = event.target.value;
    await this.setState({ data })
  }

  async saveHandler(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const response = await fetch('/api/assignment/review/save/' + urlParams.get('classId') + '/' + urlParams.get('asgmtId'), {
        method: 'PUT',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          classId: urlParams.get('classId'),
          asgmtId: urlParams.get('asgmtId'),
          reviewerId: this.state.reviewerId,
          submitorId: this.state.submitorId,
          submissionURI: this.state.submissionURI,
          data: this.state.data
        })
      });
    const data = await response.json();
    renderMessage(data)
  }

  async submitHandler(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const response = await fetch('/api/assignment/review/submit/' + urlParams.get('classId') + '/' + urlParams.get('asgmtId'), {
        method: 'PUT',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          classId: urlParams.get('classId'),
          asgmtId: urlParams.get('asgmtId'),
          reviewerId: this.state.reviewerId,
          submitorId: this.state.submitorId,
          submissionURI: this.state.submissionURI,
          data: this.state.data
        })
      });
    const data = await response.json();
    renderMessage(data)
    if (data.status === 'success') {
        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
        ReactDOM.unmountComponentAtNode(document.getElementById('review-criteria-container'));
        await getAssignmentContents();
        if (!document.getElementById('reviewpeers-btn')) {
          document.getElementById('metareview-btn').click();
        } else {
          document.getElementById('reviewpeers-btn').click();
        }
        document.getElementById('review-item').src = ' ';
      }
  };

  render () {
    for (let i = 0; i < this.state.criteria.length; i++) {
      const selectedBoundary = this.state.data[i].boundary;
      if (selectedBoundary === null || selectedBoundary === undefined) {
        this.state.code.push(
          <div id={"boundaries-" + (i+1)} class="boundary-container">
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)}>
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)}>
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)}>
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)}>
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      } else if (selectedBoundary === 1) {
        this.state.code.push(
          <div id={"boundaries-" + (i+1)} class="boundary-container">
          <div className="boundary-wrapper" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}} onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)}>
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)}>
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)}>
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)}>
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      } else if (selectedBoundary === 2) {
        this.state.code.push(
          <div id={"boundaries-" + (i+1)} class="boundary-container">
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)}>
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary-wrapper" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}} onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)}>
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)}>
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)}>
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      } else if (selectedBoundary === 3) {
        this.state.code.push(
          <div id={"boundaries-" + (i+1)} class="boundary-container">
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)}>
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)}>
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary-wrapper" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}} onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)}>
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)}>
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      } else {
        this.state.code.push(
          <div id={"boundaries-" + (i+1)} class="boundary-container">
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)}>
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)}>
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary-wrapper" onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)}>
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary-wrapper" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}} onClick={() => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)}>
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      }
    }
    return (
      <form onSubmit={this.submitHandler}>
      {
        this.state.criteria.map((val, i) =>
          <div key={i} id={this.state.criteria[i].criteriaNum} className="criteria-box padding-0810">
          <h3>Criterion: {this.state.criteria[i].criterion}</h3>
          <p className="criteria-description">Criterion Description: {this.state.criteria[i].description}</p>
          <p>Leave some constructive feedback...</p>
          <textarea className="criterionDescription" type="text" data-criterianum={i} name="comments" placeholder="Comments go here" minLength="0" maxLength="300" onChange={this.changeHandler}>
          {this.state.data[i].comments}
          </textarea>
          <p>Select a boundary:</p>
          {this.state.code[i]}
          <p>Marks:</p>
          <input className="criteria-marks" type="number" data-criterianum={i} name="marksGiven" min="0" max={this.state.data[i].marksMax} value={this.state.data[i].marksGiven} onChange={this.changeHandler} />
          </div>
        )
      }
      <input className="review-submit-btn" type="button" onClick={this.saveHandler} value="Save Review" />
      <input className="review-submit-btn" type="submit" value="Submit Review" />
      </form>
    )
  }
};
// Tier 1
class MetareviewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewerId: props.reviewData.reviewerId,
      reviews: props.reviewData.reviews,
    }
  }

  render() {
    for (let i = 0; i < this.state.reviews.length; i++) {
      this.state.reviews[i].completedReview = (this.state.reviews[i].completedReview === 1) ? <span className="far fa-check-circle"/> : <span className="far fa-times-circle"/>;
    }
    if (this.state.reviews.length === 0) {
      return (
        <div id="meta-review-box" className="meta-review-container">
        <p className="txt-l1 default-msg">No meta reviews to do as of now.</p>
        </div>
      )
    } else {
      return (
        <div id="meta-review-box" className="meta-review-container">
        <div className="asgmt-title">
        <h2>Meta Review Students</h2>
        </div>
        {this.state.reviews.map((name, i) =>
          <div key={i.toString()} className="cmpnt-container-l padding-0810">
          <section className="cmpnt-name">
          <h1>#{i+1}</h1>
          </section>
          <div className="cmpnt-seperator"></div>
          <section className="cmpnt-info-l alt-end">
          <a onClick={() => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI)} className="review-btn">Review Work</a>
          <a onClick={() => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI)} className="review-btn">Edit Review</a>
          <a onClick={() => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI)} className="review-btn">View Review</a>
          <p>Completed: {this.state.reviews[i].completedReview}</p>
          </section>
          </div>
        )}
        </div>
      )
    }
  }
};
class ResultsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classResults: props.resultsData.classResults,
      studentResults: props.resultsData.studentResults,
      criteriaForm: props.resultsData.criteriaForm,
      boundaries: []
    }
  }
  // just do a for loop for 1,2,3,4 and total them then get % then assign colours
  render() {
    for (let i = 0; i < this.state.classResults.criteria.length; i++) {
      if (this.state.classResults.criteria[i].boundaries.length === 0) {
        this.state.boundaries.push(
          <div className="mark-boundaries">
          <div className="boundary">
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary">
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary">
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary">
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      } else {
        let oneVal = 0;
        let twoVal = 0;
        let threeVal = 0;
        let fourVal = 0;
        for (let x = 0; x < this.state.classResults.criteria[i].boundaries.length; x++) {
          if (this.state.classResults.criteria[i].boundaries[x] === 1) {
            oneVal += 1;
          } else if (this.state.classResults.criteria[i].boundaries[x] === 2) {
            twoVal += 1;
          } else if (this.state.classResults.criteria[i].boundaries[x] === 3) {
            threeVal += 1;
          } else {
            fourVal += 1;
          }
        }
        oneVal = (oneVal / this.state.classResults.criteria[i].boundaries.length);
        twoVal = (twoVal / this.state.classResults.criteria[i].boundaries.length);
        threeVal = (threeVal / this.state.classResults.criteria[i].boundaries.length);
        fourVal = (fourVal / this.state.classResults.criteria[i].boundaries.length);
        this.state.boundaries.push(
          <div className="mark-boundaries">
          <div className="boundary" style={{backgroundColor: `rgba(20, 120, 250, ${oneVal})`}}>
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary" style={{backgroundColor: `rgba(20, 120, 250, ${twoVal})`}}>
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary" style={{backgroundColor: `rgba(20, 120, 250, ${threeVal})`}}>
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary" style={{backgroundColor: `rgba(20, 120, 250, ${fourVal})`}}>
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      }
    }

    return (
      <div id="results-box" className="results-container">
      <div className="asgmt-title">
      <h2>Class Results</h2>
      </div>
      <section className="asgmt-class-results padding-0810">
      <div className="asgmt-stats">
      <p>Class Lowest: {this.state.classResults.lowestMarksPercentage}%</p>
      <div className="asgmt-seperator"></div>
      <p>Class Average: {this.state.classResults.avgMarksPercentage}%</p>
      <div className="asgmt-seperator"></div>
      <p>Class Highest: {this.state.classResults.highestMarksPercentage}%</p>
      </div>
      <div className="asgmt-criteria">
      {this.state.criteriaForm.map((val, i) =>
        <div className="criteria-container">
        <h3>{this.state.criteriaForm[i].criterion}:</h3>
        <p>Average Mark - {this.state.classResults.criteria[i].avgMarksAchieved} / {this.state.classResults.criteria[i].maxMarks}</p>
        <p>{this.state.criteriaForm[i].description}</p>
        {this.state.boundaries[i]}
        </div>
      )}
      </div>
      </section>
      <div className="asgmt-title">
      <h2>Student Results</h2>
      </div>
      <section className="asgmt-students-results">
      {this.state.studentResults.map((val, i) =>
        <div className="asgmt-container-l padding-0810">
        <section className="asgmt-name">
        <p>{this.state.studentResults[i].name}</p>
        </section>
        <div className="asgmt-seperator-alt"></div>
        <section className="student-result">
        <p>Result: {this.state.studentResults[i].resultPercentage}% ({this.state.studentResults[i].resultMarks})</p>
        </section>
        <div className="asgmt-seperator-alt"></div>
        <section className="student-result-btns">
        <a onClick={() => renderSubmission(this.state.studentResults[i].submissionURI, this.state.studentResults[i].name)} className="student-result-btn">
        <p>View Submission</p>
        </a>
        <a onClick={() => renderFeedbackGiven(this.state.studentResults[i].userId, this.state.studentResults[i].name, this.state.criteriaForm)} className="student-result-btn">
        <p>View Feedback Given</p>
        </a>
        <a onClick={() => renderFeedbackTaken(this.state.studentResults[i].userId, this.state.studentResults[i].name, this.state.criteriaForm)} className="student-result-btn">
        <p>View Feedback Taken</p>
        </a>
        </section>
        </div>
      )}
      </section>
      </div>
    )
  }
};
// Tier 0
class SubmitContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    }
    this.currentSubmission = props.currentSubmission;
    this.openLocalFilePicker = this.openLocalFilePicker.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.submitProxy = this.submitProxy.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  async openLocalFilePicker() {
    document.getElementById('file-selector').click();
  }

  fileHandler(event) {
    this.setState({file: event.target.files[0]});
    document.getElementById('selected-file').textContent = event.target.files[0].name;
  }

  validate(data) {
    const err = document.getElementById('submit-error');
    err.style.display = "none";
    if (data === null || undefined) {
      err.textContent = "You have not selected a file to be submitted.";
      return false;
    }
    if (data.type !== "application/pdf") {
      err.textContent = "The file you have chosen to submit is not a PDF. Please make sure that the attached file is in the PDF format before attempting to submit again.";
      return false;
    }
    return true;
  }

  submitProxy() {
    document.getElementById('file-submit').click();
  }

  async submitHandler(event) {
    event.preventDefault();
    const result = await this.validate(this.state.file);
    if (result === true) {
      const urlParams = new URLSearchParams(window.location.search);
      const fileData = new FormData();
      fileData.append('file', this.state.file);
      const response = await fetch('/api/assignment/submission/' + urlParams.get('classId') + '/' + urlParams.get('asgmtId'), {
        method: 'POST',
        body: fileData
      });
      const data = await response.json();
      if (data.status === 'success') {
        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
        await getAssignmentContents();
        document.getElementById('submit-btn').click();
      }
      renderMessage(data);
    } else {
      const err = document.getElementById('submit-error');
      err.style.display = "flex";
    }
  }

  render () {
    return (
      <div id="submit-box" className="submit-container">
      <div className="file-select-container">
      <h1 id="submit-title" className="">Submission</h1>
      <div id="current-submission">
      <p>Your have currently submitted:</p>
      <p className="overflow">{this.currentSubmission}</p>
      <p>If you submit again the old submission will be deleted and replaced with the new submission.</p>
      </div>
      <p className="submit-description">You can submit your work below using the local file method provided. Please ensure the work you have selected is the correct one.</p>
      <section className="upload-wrapper">
      <div className="file-select-btn" onClick={() => this.openLocalFilePicker()}>Local File</div>
      <form id="upload-form" onSubmit={this.submitHandler}>
      <input id="file-selector" type="file" name="file" onChange={this.fileHandler} value={this.state.value} />
      <input id="file-submit" type="submit" value="Submit" />
      </form>
      <div id="result"></div>
      </section>
      <p>Your file selected to be submitted:</p>
      <p id="selected-file"></p>
      <p id="submit-error"></p>
      </div>
      <div className="submit-wrapper" onClick={() => this.submitProxy()}>Submit Your Work</div>
      </div>
    )
  }
};
class FeedbackContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitorId: props.feedbackData.submitorId,
      criteria: props.feedbackData.criteria,
      feedback: props.feedbackData.feedback
    }

    for (let i = 0; i < this.state.criteria.length; i++) {
      for (let x = 0; x < this.state.feedback[i].data.length; x++) {
        const boundaryNum = this.state.feedback[i].data[x].boundary;
        if (boundaryNum === 1) {
          this.state.feedback[i].data[x].boundary = (
            <div class="boundary-container">
            <section class="boundary-wrapper active-boundary">
            <p>Work does not meet the criterion.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work meets some aspects of the criterion, but not all.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work mostly meets the criterion.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work very clearly meets the criterion.</p>
            </section>
            </div>
          )
        } else if (boundaryNum === 2) {
          this.state.feedback[i].data[x].boundary = (
            <div class="boundary-container">
            <section class="boundary-wrapper">
            <p>Work does not meet the criterion.</p>
            </section>
            <section class="boundary-wrapper active-boundary">
            <p>Work meets some aspects of the criterion, but not all.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work mostly meets the criterion.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work very clearly meets the criterion.</p>
            </section>
            </div>
          )
        } else if (boundaryNum === 3) {
          this.state.feedback[i].data[x].boundary = (
            <div class="boundary-container">
            <section class="boundary-wrapper">
            <p>Work does not meet the criterion.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work meets some aspects of the criterion, but not all.</p>
            </section>
            <section class="boundary-wrapper active-boundary">
            <p>Work mostly meets the criterion.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work very clearly meets the criterion.</p>
            </section>
            </div>
          )
        } else {
          this.state.feedback[i].data[x].boundary = (
            <div class="boundary-container">
            <section class="boundary-wrapper">
            <p>Work does not meet the criterion.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work meets some aspects of the criterion, but not all.</p>
            </section>
            <section class="boundary-wrapper">
            <p>Work mostly meets the criterion.</p>
            </section>
            <section class="boundary-wrapper active-boundary">
            <p>Work very clearly meets the criterion.</p>
            </section>
            </div>
          )
        }
      }
    }
  }

  render() {
    if (this.state.criteria.length === 0) {
      return (
        <div id="feedback-box" className="feedback-container">
        <p className="txt-l1 default-msg">No feedback to display as of now.</p>
        </div>
      )
    } else {
      return (
        <div id="feedback-box" className="feedback-container">
        {this.state.criteria.map((val, i) =>
          <div className="feedback-wrapper padding-0810">
          <div className="feedback-criterion-wrapper">
          <h3>{this.state.criteria[i].criterion}</h3>
          <p>Description: {this.state.criteria[i].description}</p>
          </div>
          {this.state.feedback[i].data.map((val, x) =>
            <div className="feedback-subwrapper">
            <h3>Feedback by {this.state.feedback[i].data[x].reviewerTier}:</h3>
            <p>Marks Given: {this.state.feedback[i].data[x].marksGiven} / {this.state.criteria[i].marksMax}</p>
            {this.state.feedback[i].data[x].boundary}
            <p className="feedback-textual padding-0810">Comments: {this.state.feedback[i].data[x].comments}</p>
            </div>
          )}
          </div>
        )}
        </div>
      )
    }
  }
};
class ReviewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewerId: props.reviewData.reviewerId,
      reviews: props.reviewData.reviews,
    }
  }

  render() {
    for (let i = 0; i < this.state.reviews.length; i++) {
      this.state.reviews[i].completedReview = (this.state.reviews[i].completedReview === 1) ? <span className="far fa-check-circle"/> : <span className="far fa-times-circle"/>;
    }
    // view review just loads it into boxes
    // when in reviewdata groups work out if it should be a completed tick or a x
    if (this.state.reviews.length === 0) {
      return (
        <div id="review-box" className="review-container">
        <p className="txt-l1 default-msg">No reviews to do as of now.</p>
        </div>
      )
    } else {
      return (
        <div id="review-box" className="review-container">
        <div className="asgmt-title">
        <h2>Review Peers</h2>
        </div>
        {this.state.reviews.map((val, i) =>
          <div key={i.toString()} className="cmpnt-container-l padding-0810">
          <section className="cmpnt-name">
          <h1>#{i+1}</h1>
          </section>
          <div className="cmpnt-seperator"></div>
          <section className="cmpnt-info-l alt-end">
          <a onClick={() => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI)} className="review-btn">Review Work</a>
          <a onClick={() => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI)} className="review-btn">Edit Review</a>
          <a onClick={() => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI)} className="review-btn">View Review</a>
          <p>Completed: {this.state.reviews[i].completedReview}</p>
          </section>
          </div>
        )}
        </div>
      )
    }
  }
};

/**
* renderReview(submitorId, submissionURI) -
* Renders a selected review.
* @param {String} submitorId The ID of the user who submitted the work being requested
* @param {String} submissionURI The works submission URI
*/
async function renderReview(submitorId, submissionURI) {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('classId');
  const asgmtId = urlParams.get('asgmtId');

  document.getElementById('review-item').src = '/api/assignment/view/' + submissionURI;

  const url = '/api/assignment/review?classId=' + classId + '&asgmtId=' + asgmtId + '&submitorId=' + submitorId;
  const data = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const reviewData = await data.json();

  const content = <ReviewingContainer reviewerId={reviewData.reviewerId}
  submitorId={reviewData.submitorId}
  submissionURI={reviewData.submissionURI}
  criteria={reviewData.form} data={reviewData.data} />

  ReactDOM.render(
    content,
    document.getElementById('review-criteria-container')
  );
  loadReview();
};

async function renderFeedbackGiven(userId, userName, criteria) {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('classId');
  const asgmtId = urlParams.get('asgmtId');

  const reviews = await fetch(('/api/assignment/reviews/given?classId=' + classId + '&asgmtId=' + asgmtId + '&userId=' + userId), {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  })
  const reviewsData = await reviews.json();

  if (reviewsData.status === 'fail') {
    renderMessage(reviewsData)
  } else {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
    const modal = <ModalContainer modal=<ReviewsGivenModal reviewsData={reviewsData} submitor={userName} criteria={criteria} /> />
    ReactDOM.render(
      modal,
      document.getElementById('modal-container')
    );
    openModal();
  }
};

async function renderFeedbackTaken(userId, userName, criteria) {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('classId');
  const asgmtId = urlParams.get('asgmtId');

  const reviews = await fetch(('/api/assignment/reviews/recieved?classId=' + classId + '&asgmtId=' + asgmtId + '&userId=' + userId), {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  })
  const reviewsData = await reviews.json();

  if (reviewsData.status === 'fail') {
    renderMessage(reviewsData)
  } else {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
    const modal = <ModalContainer modal=<ReviewsTakenModal reviewsData={reviewsData} submitor={userName} criteria={criteria} /> />
    ReactDOM.render(
      modal,
      document.getElementById('modal-container')
    );
    openModal();
  }
};

//----- Functions used to perform operations on UI components
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
