'use strict'; //------------- GLOBAL VARIABLES -------------//
// Assignment UI Component Functions

async function getAssignmentContents() {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('classId');
  const asgmtId = urlParams.get('asgmtId');
  let attachments; // Get the users tier

  const tierResponse = await fetch('/api/user/tier', {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const uTier = await tierResponse.json(); // Get the assignment

  const url = '/api/assignment?classId=' + classId + '&asgmtId=' + asgmtId;
  const asgmtResponse = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const asgmtData = await asgmtResponse.json(); // Create the file attchment elements

  if (asgmtData[0].fileThree !== null) {
    attachments = React.createElement("div", null, React.createElement("form", {
      method: "GET",
      action: "/api/assignment/download/" + asgmtData[0].fileOne
    }, React.createElement("button", {
      type: "submit",
      className: "download-btn transition-01"
    }, "File 1: ", asgmtData[0].fileOneName)), React.createElement("form", {
      method: "GET",
      action: "/api/assignment/download/" + asgmtData[0].fileTwo
    }, React.createElement("button", {
      type: "submit",
      className: "download-btn transition-01"
    }, "File 2: ", asgmtData[0].fileTwoName)), React.createElement("form", {
      method: "GET",
      action: "/api/assignment/download/" + asgmtData[0].fileThree
    }, React.createElement("button", {
      type: "submit",
      className: "download-btn transition-01"
    }, "File 3: ", asgmtData[0].fileThreeName)));
  } else if (asgmtData[0].fileTwo !== null) {
    attachments = React.createElement("div", null, React.createElement("form", {
      method: "GET",
      action: "/api/assignment/download/" + asgmtData[0].fileOne
    }, React.createElement("button", {
      type: "submit",
      className: "download-btn transition-01"
    }, "File 1: ", asgmtData[0].fileOneName)), React.createElement("form", {
      method: "GET",
      action: "/api/assignment/download/" + asgmtData[0].fileTwo
    }, React.createElement("button", {
      type: "submit",
      className: "download-btn transition-01"
    }, "File 2: ", asgmtData[0].fileTwoName)));
  } else if (asgmtData[0].fileOne !== null) {
    attachments = React.createElement("div", null, React.createElement("form", {
      method: "GET",
      action: "/api/assignment/download/" + asgmtData[0].fileOne
    }, React.createElement("button", {
      type: "submit",
      className: "download-btn transition-01"
    }, "File 1: ", asgmtData[0].fileOneName)));
  } else {
    attachments = "No files, please contact the teacher of this class.";
  }

  if (uTier === 1) {
    const url = '/api/assignment/details?classId=' + classId + '&asgmtId=' + asgmtId;
    const detailsResponse = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const detailsData = await detailsResponse.json();
    const reviews = await fetch('/api/assignment/reviews?classId=' + classId + '&asgmtId=' + asgmtId, {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const reviewData = await reviews.json();
    const results = await fetch('/api/assignment/results?classId=' + classId + '&asgmtId=' + asgmtId, {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const resultsData = await results.json();
    console.log(resultsData);
    const content = React.createElement(AsgmtContentGenerator, {
      tier: uTier,
      title: asgmtData[0].title,
      description: asgmtData[0].description,
      workDueDate: asgmtData[0].dueDateSubmissions,
      reviewsDueDate: asgmtData[0].dueDateReviews,
      numReviews: asgmtData[0].numReviews,
      attachments: attachments,
      res1: asgmtData[0].resourceOne,
      res2: asgmtData[0].resourceTwo,
      res3: asgmtData[0].resourceThree,
      deadlineCounter: "placeholder",
      classSize: detailsData.classSize,
      numSubmissionsCompleted: detailsData.numSubmissions,
      numReviewsCompleted: detailsData.numReviews,
      studentData: detailsData.studentData,
      reviewData: reviewData,
      resultsData: resultsData
    });
    ReactDOM.render(content, document.getElementById('page-content'));
  } else {
    // Get users submission status and data
    const submissionStatus = await fetch('/api/assignment/submission/status?classId=' + classId + '&asgmtId=' + asgmtId, {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const submissionFile = await submissionStatus.text(); // Get reviews assigned to user if any

    const reviews = await fetch('/api/assignment/reviews?classId=' + classId + '&asgmtId=' + asgmtId, {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const reviewData = await reviews.json();
    const feedback = await fetch('/api/assignment/feedback?classId=' + classId + '&asgmtId=' + asgmtId, {
      method: 'GET',
      credentials: 'include',
      cache: 'default'
    });
    const feedbackData = await feedback.json();
    console.log("FEEEDBACKKKK");
    console.log(feedbackData);
    const content = React.createElement(AsgmtContentGenerator, {
      tier: uTier,
      title: asgmtData[0].title,
      description: asgmtData[0].description,
      workDueDate: asgmtData[0].dueDateSubmissions,
      reviewsDueDate: asgmtData[0].dueDateReviews,
      numReviews: asgmtData[0].numReviews,
      attachments: attachments,
      res1: asgmtData[0].resourceOne,
      res2: asgmtData[0].resourceTwo,
      res3: asgmtData[0].resourceThree,
      currentSubmission: submissionFile,
      reviewData: reviewData,
      feedbackData: feedbackData
    });
    ReactDOM.render(content, document.getElementById('page-content'));

    if (submissionFile !== '') {
      document.getElementById('current-submission').style.display = "flex";
    }
  }
}

;

function AsgmtContentGenerator(props) {
  if (props.tier === 1) {
    return React.createElement(React.Fragment, null, React.createElement(AsgmtContainer, {
      title: props.title,
      description: props.description,
      workDueDate: props.workDueDate,
      reviewsDueDate: props.reviewsDueDate,
      numReviews: props.numReviews,
      attachments: props.attachments,
      file1: props.file1,
      file2: props.file2,
      file3: props.file3,
      res1: props.res1,
      res2: props.res2,
      res3: props.res3
    }), React.createElement(DetailsContainer, {
      classSize: props.classSize,
      numSubmissionsCompleted: props.numSubmissionsCompleted,
      numReviewsCompleted: props.numReviewsCompleted,
      numReviewsToDo: props.numReviews,
      deadlineCounter: props.deadlineCounter,
      studentData: props.studentData,
      criteriaForm: props.resultsData.criteriaForm
    }), React.createElement(MetareviewContainer, {
      reviewData: props.reviewData
    }), React.createElement(ResultsContainer, {
      resultsData: props.resultsData
    }));
  } else {
    return React.createElement(React.Fragment, null, React.createElement(AsgmtContainer, {
      title: props.title,
      description: props.description,
      workDueDate: props.workDueDate,
      reviewsDueDate: props.reviewsDueDate,
      numReviews: props.numReviews,
      attachments: props.attachments,
      file1: props.file1,
      file2: props.file2,
      file3: props.file3,
      res1: props.res1,
      res2: props.res2,
      res3: props.res3
    }), React.createElement(SubmitContainer, {
      currentSubmission: props.currentSubmission
    }), React.createElement(ReviewContainer, {
      reviewData: props.reviewData
    }), React.createElement(FeedbackContainer, {
      feedbackData: props.feedbackData
    }));
  }
}

; //----- Used to construct and render the UI components
// All users

function AsgmtContainer(props) {
  return React.createElement("div", {
    id: "asgmt-box",
    className: "assignment-container"
  }, React.createElement("h1", {
    id: "asgmt-title",
    className: ""
  }, props.title), React.createElement("p", {
    className: "asgmt-description"
  }, props.description), React.createElement("h2", {
    id: "details-title"
  }, "Details -"), React.createElement("p", null, "Work Due: ", props.workDueDate), React.createElement("p", null, "Reviews Due: ", props.reviewsDueDate), React.createElement("p", null, "Peer Reviews Set: ", props.numReviews), React.createElement("h2", {
    id: "attached-files-title"
  }, "Attached Files -"), props.attachments, React.createElement("h2", {
    id: "resources-title"
  }, "Useful Resources -"), React.createElement("p", null, "Resource 1: ", props.res1), React.createElement("p", null, "Resource 2: ", props.res2), React.createElement("p", null, "Resource 3: ", props.res3));
}

;

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
    };
  }

  render() {
    return React.createElement("div", {
      id: "details-box",
      className: "details-container"
    }, React.createElement("div", {
      className: "asgmt-title"
    }, React.createElement("h2", null, "Overview")), React.createElement("div", {
      className: "cmpnt-container-l asgmt-cmpnt-container-l padding-0810"
    }, React.createElement("section", {
      className: "cmpnt-info-l"
    }, React.createElement("p", null, "Total Submissions: ", this.state.numSubmissions, " / ", this.state.classSize)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-info-l"
    }, React.createElement("p", null, "Total Reviews: ", this.state.numReviews, " / ", this.state.classSize)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-info-l"
    }, React.createElement("p", null, "Time Till Deadline: ", this.state.deadlineCounter))), React.createElement("div", {
      className: "asgmt-title"
    }, React.createElement("h2", null, "Students")), this.state.studentData.map((userId, i) => React.createElement("div", {
      key: i.toString(),
      className: "cmpnt-container-l padding-0810"
    }, React.createElement("section", {
      className: "cmpnt-name"
    }, React.createElement("h1", null, this.state.studentData[i].name)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-info-l"
    }, React.createElement("p", null, "Submitted: ", this.state.studentData[i].submissionCompleted, " / 1"), React.createElement("p", null, "Reviews Completed: ", this.state.studentData[i].reviewsCompleted, " / ", this.state.studentData[i].reviewsAssigned)), React.createElement("div", {
      className: "cmpnt-seperator"
    }), React.createElement("section", {
      className: "cmpnt-btn-container-l"
    }, React.createElement("div", {
      className: "default-btns-l"
    }, React.createElement("a", {
      onClick: () => renderSubmission(this.state.studentData[i].submissionURI, this.state.studentData[i].name),
      className: "cmpnt-btn-l asgmt-cmpnt-btn-l addon-m-10w"
    }, React.createElement("p", null, "View Submission")), React.createElement("a", {
      onClick: () => renderFeedbackGiven(this.state.studentData[i].userId, this.state.studentData[i].name, this.state.criteriaForm),
      className: "cmpnt-btn-l asgmt-cmpnt-btn-l addon-m-10w"
    }, React.createElement("p", null, "View Reviews")))))));
  }

}

;

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
    };
    this.selectBoundary = this.selectBoundary.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  async selectBoundary(criteriaNum, boundaryId) {
    console.log(criteriaNum, boundaryId); // Get parent element

    const parentElem = document.getElementById("boundaries-" + criteriaNum); // Get the old selected boundary's id

    const oldElemId = this.state.data[criteriaNum - 1].boundary;

    if (oldElemId !== undefined && oldElemId !== null) {
      const oldElem = parentElem.children[oldElemId - 1];
      oldElem.style.color = "#000";
      oldElem.style.backgroundColor = "#fff";
    } // Set the new selected boundry


    this.state.data[criteriaNum - 1].boundary = boundaryId;
    const newElem = parentElem.children[boundaryId - 1];
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
    await this.setState({
      data
    });
  } // only save changes make a comparison feature
  // set to run every x seconds or make dupe function with not msg notification


  async saveHandler(event) {
    event.preventDefault(); //const result = await this.validate(this.state); err check
    //if (result === true) {

    const urlParams = new URLSearchParams(window.location.search);
    const response = await fetch('/api/assignment/review/save', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
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
    renderMessage(data); //}
  } // catch error for blank or missing inputs on submission but not save
  // add checks to check for missing stuff


  async submitHandler(event) {
    event.preventDefault(); //const result = await this.validate(this.state); err check
    //if (result === true) {

    const urlParams = new URLSearchParams(window.location.search);
    const response = await fetch('/api/assignment/review/submit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
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
    renderMessage(data);

    if (data.status === 'success') {
      ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
      await getAssignmentContents();

      if (!document.getElementById('reviewpeers-btn')) {
        document.getElementById('metareview-btn').click();
      } else {
        document.getElementById('reviewpeers-btn').click();
      }
    } //}

  }

  render() {
    for (let i = 0; i < this.state.criteria.length; i++) {
      const selectedBoundary = this.state.data[i].boundary;

      if (selectedBoundary === null || selectedBoundary === undefined) {
        this.state.code.push(React.createElement("div", {
          id: "boundaries-" + (i + 1),
          class: "boundary-container"
        }, React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)
        }, React.createElement("p", null, "Work very clearly meets the criterion."))));
      } else if (selectedBoundary === 1) {
        this.state.code.push(React.createElement("div", {
          id: "boundaries-" + (i + 1),
          class: "boundary-container"
        }, React.createElement("div", {
          className: "boundary-wrapper",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          },
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)
        }, React.createElement("p", null, "Work very clearly meets the criterion."))));
      } else if (selectedBoundary === 2) {
        this.state.code.push(React.createElement("div", {
          id: "boundaries-" + (i + 1),
          class: "boundary-container"
        }, React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          },
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)
        }, React.createElement("p", null, "Work very clearly meets the criterion."))));
      } else if (selectedBoundary === 3) {
        this.state.code.push(React.createElement("div", {
          id: "boundaries-" + (i + 1),
          class: "boundary-container"
        }, React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary-wrapper",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          },
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)
        }, React.createElement("p", null, "Work very clearly meets the criterion."))));
      } else {
        this.state.code.push(React.createElement("div", {
          id: "boundaries-" + (i + 1),
          class: "boundary-container"
        }, React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 1)
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 2)
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary-wrapper",
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 3)
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary-wrapper",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          },
          onClick: () => this.selectBoundary(this.state.criteria[i].criteriaNum, 4)
        }, React.createElement("p", null, "Work very clearly meets the criterion."))));
      }
    }

    return React.createElement("form", {
      onSubmit: this.submitHandler
    }, this.state.criteria.map((val, i) => React.createElement("div", {
      key: i,
      id: this.state.criteria[i].criteriaNum,
      className: "criteria-box padding-0810"
    }, React.createElement("h3", null, "Criterion: ", this.state.criteria[i].criterion), React.createElement("p", {
      className: "criteria-description"
    }, "Criterion Description: ", this.state.criteria[i].description), React.createElement("p", null, "Leave some constructive feedback..."), React.createElement("textarea", {
      className: "criterionDescription",
      type: "text",
      "data-criterianum": i,
      name: "comments",
      placeholder: "Comments go here",
      minLength: "0",
      maxLength: "300",
      onChange: this.changeHandler
    }, this.state.data[i].comments), React.createElement("p", null, "Select a boundary:"), this.state.code[i], React.createElement("p", null, "Marks:"), React.createElement("input", {
      className: "criteria-marks",
      type: "number",
      "data-criterianum": i,
      name: "marksGiven",
      min: "0",
      max: this.state.data[i].marksMax,
      value: this.state.data[i].marksGiven,
      onChange: this.changeHandler
    }))), React.createElement("input", {
      className: "review-submit-btn",
      type: "button",
      onClick: this.saveHandler,
      value: "Save Review"
    }), React.createElement("input", {
      className: "review-submit-btn",
      type: "submit",
      value: "Submit Review"
    }));
  }

}

; // Tier 1

class MetareviewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewerId: props.reviewData.reviewerId,
      reviews: props.reviewData.reviews
    };
  }

  render() {
    for (let i = 0; i < this.state.reviews.length; i++) {
      this.state.reviews[i].completedReview = this.state.reviews[i].completedReview === 1 ? React.createElement("span", {
        className: "far fa-check-circle"
      }) : React.createElement("span", {
        className: "far fa-times-circle"
      });
    }

    if (this.state.reviews.length === 0) {
      return React.createElement("div", {
        id: "meta-review-box",
        className: "meta-review-container"
      }, React.createElement("p", {
        className: "txt-l1 default-msg"
      }, "No meta reviews to do as of now."));
    } else {
      return React.createElement("div", {
        id: "meta-review-box",
        className: "meta-review-container"
      }, React.createElement("div", {
        className: "asgmt-title"
      }, React.createElement("h2", null, "Meta Review Students")), this.state.reviews.map((name, i) => React.createElement("div", {
        key: i.toString(),
        className: "cmpnt-container-l padding-0810"
      }, React.createElement("section", {
        className: "cmpnt-name"
      }, React.createElement("h1", null, "#", i + 1)), React.createElement("div", {
        className: "cmpnt-seperator"
      }), React.createElement("section", {
        className: "cmpnt-info-l alt-end"
      }, React.createElement("a", {
        onClick: () => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI),
        className: "review-btn"
      }, "Review Work"), React.createElement("a", {
        onClick: () => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI),
        className: "review-btn"
      }, "Edit Review"), React.createElement("a", {
        onClick: () => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI),
        className: "review-btn"
      }, "View Review"), React.createElement("p", null, "Completed: ", this.state.reviews[i].completedReview)))));
    }
  }

}

;

class ResultsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classResults: props.resultsData.classResults,
      studentResults: props.resultsData.studentResults,
      criteriaForm: props.resultsData.criteriaForm,
      boundaries: []
    };
  } // just do a for loop for 1,2,3,4 and total them then get % then assign colours


  render() {
    for (let i = 0; i < this.state.classResults.criteria.length; i++) {
      if (this.state.classResults.criteria[i].boundaries.length === 0) {
        this.state.boundaries.push(React.createElement("div", {
          className: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work very clearly meets the criterion."))));
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

        oneVal = oneVal / this.state.classResults.criteria[i].boundaries.length;
        twoVal = twoVal / this.state.classResults.criteria[i].boundaries.length;
        threeVal = threeVal / this.state.classResults.criteria[i].boundaries.length;
        fourVal = fourVal / this.state.classResults.criteria[i].boundaries.length;
        this.state.boundaries.push(React.createElement("div", {
          className: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary",
          style: {
            backgroundColor: `rgba(20, 120, 250, ${oneVal})`
          }
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary",
          style: {
            backgroundColor: `rgba(20, 120, 250, ${twoVal})`
          }
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary",
          style: {
            backgroundColor: `rgba(20, 120, 250, ${threeVal})`
          }
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary",
          style: {
            backgroundColor: `rgba(20, 120, 250, ${fourVal})`
          }
        }, React.createElement("p", null, "Work very clearly meets the criterion."))));
      }
    }

    return React.createElement("div", {
      id: "results-box",
      className: "results-container"
    }, React.createElement("div", {
      className: "asgmt-title"
    }, React.createElement("h2", null, "Class Results")), React.createElement("section", {
      className: "asgmt-class-results padding-0810"
    }, React.createElement("div", {
      className: "asgmt-stats"
    }, React.createElement("p", null, "Class Lowest: ", this.state.classResults.lowestMarksPercentage, "%"), React.createElement("div", {
      className: "asgmt-seperator"
    }), React.createElement("p", null, "Class Average: ", this.state.classResults.avgMarksPercentage, "%"), React.createElement("div", {
      className: "asgmt-seperator"
    }), React.createElement("p", null, "Class Highest: ", this.state.classResults.highestMarksPercentage, "%")), React.createElement("div", {
      className: "asgmt-criteria"
    }, this.state.criteriaForm.map((val, i) => React.createElement("div", {
      className: "criteria-container"
    }, React.createElement("h3", null, this.state.criteriaForm[i].criterion, ":"), React.createElement("p", null, "Average Mark - ", this.state.classResults.criteria[i].avgMarksAchieved, " / ", this.state.classResults.criteria[i].maxMarks), React.createElement("p", null, this.state.criteriaForm[i].description), this.state.boundaries[i])))), React.createElement("div", {
      className: "asgmt-title"
    }, React.createElement("h2", null, "Student Results")), React.createElement("section", {
      className: "asgmt-students-results"
    }, this.state.studentResults.map((val, i) => React.createElement("div", {
      className: "asgmt-container-l padding-0810"
    }, React.createElement("section", {
      className: "asgmt-name"
    }, React.createElement("p", null, this.state.studentResults[i].name)), React.createElement("div", {
      className: "asgmt-seperator-alt"
    }), React.createElement("section", {
      className: "student-result"
    }, React.createElement("p", null, "Result: ", this.state.studentResults[i].resultPercentage, "% (", this.state.studentResults[i].resultMarks, ")")), React.createElement("div", {
      className: "asgmt-seperator-alt"
    }), React.createElement("section", {
      className: "student-result-btns"
    }, React.createElement("a", {
      onClick: () => renderSubmission(this.state.studentResults[i].submissionURI, this.state.studentResults[i].name),
      className: "student-result-btn"
    }, React.createElement("p", null, "View Submission")), React.createElement("a", {
      onClick: () => renderFeedbackGiven(this.state.studentResults[i].userId, this.state.studentResults[i].name, this.state.criteriaForm),
      className: "student-result-btn"
    }, React.createElement("p", null, "View Feedback Given")), React.createElement("a", {
      onClick: () => renderFeedbackTaken(this.state.studentResults[i].userId, this.state.studentResults[i].name, this.state.criteriaForm),
      className: "student-result-btn"
    }, React.createElement("p", null, "View Feedback Taken")))))));
  }

}

; // Tier 0

class SubmitContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
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
    this.setState({
      file: event.target.files[0]
    });
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

  render() {
    return React.createElement("div", {
      id: "submit-box",
      className: "submit-container"
    }, React.createElement("div", {
      className: "file-select-container"
    }, React.createElement("h1", {
      id: "submit-title",
      className: ""
    }, "Submission"), React.createElement("div", {
      id: "current-submission"
    }, React.createElement("p", null, "Your have currently submitted:"), React.createElement("p", {
      className: "overflow"
    }, this.currentSubmission), React.createElement("p", null, "If you submit again the old submission will be deleted and replaced with the new submission.")), React.createElement("p", {
      className: "submit-description"
    }, "You can submit your work below using the local file method provided. Please ensure the work you have selected is the correct one."), React.createElement("section", {
      className: "upload-wrapper"
    }, React.createElement("div", {
      className: "file-select-btn",
      onClick: () => this.openLocalFilePicker()
    }, "Local File"), React.createElement("form", {
      id: "upload-form",
      onSubmit: this.submitHandler
    }, React.createElement("input", {
      id: "file-selector",
      type: "file",
      name: "file",
      onChange: this.fileHandler,
      value: this.state.value
    }), React.createElement("input", {
      id: "file-submit",
      type: "submit",
      value: "Submit"
    })), React.createElement("div", {
      id: "result"
    })), React.createElement("p", null, "Your file selected to be submitted:"), React.createElement("p", {
      id: "selected-file"
    }), React.createElement("p", {
      id: "submit-error"
    })), React.createElement("div", {
      className: "submit-wrapper",
      onClick: () => this.submitProxy()
    }, "Submit Your Work"));
  }

}

;

class FeedbackContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitorId: props.feedbackData.submitorId,
      criteria: props.feedbackData.criteria,
      feedback: props.feedbackData.feedback
    };

    for (let i = 0; i < this.state.criteria.length; i++) {
      for (let x = 0; x < this.state.feedback[i].data.length; x++) {
        const boundaryNum = this.state.feedback[i].data[x].boundary;

        if (boundaryNum === 1) {
          this.state.feedback[i].data[x].boundary = React.createElement("div", {
            class: "boundary-container"
          }, React.createElement("section", {
            class: "boundary-wrapper active-boundary"
          }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work very clearly meets the criterion.")));
        } else if (boundaryNum === 2) {
          this.state.feedback[i].data[x].boundary = React.createElement("div", {
            class: "boundary-container"
          }, React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("section", {
            class: "boundary-wrapper active-boundary"
          }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work very clearly meets the criterion.")));
        } else if (boundaryNum === 3) {
          this.state.feedback[i].data[x].boundary = React.createElement("div", {
            class: "boundary-container"
          }, React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("section", {
            class: "boundary-wrapper active-boundary"
          }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work very clearly meets the criterion.")));
        } else {
          this.state.feedback[i].data[x].boundary = React.createElement("div", {
            class: "boundary-container"
          }, React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("section", {
            class: "boundary-wrapper"
          }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("section", {
            class: "boundary-wrapper active-boundary"
          }, React.createElement("p", null, "Work very clearly meets the criterion.")));
        }
      }
    }
  }

  render() {
    if (this.state.criteria.length === 0) {
      return React.createElement("div", {
        id: "feedback-box",
        className: "feedback-container"
      }, React.createElement("p", {
        className: "txt-l1 default-msg"
      }, "No feedback to display as of now."));
    } else {
      return React.createElement("div", {
        id: "feedback-box",
        className: "feedback-container"
      }, this.state.criteria.map((val, i) => React.createElement("div", {
        className: "feedback-wrapper padding-0810"
      }, React.createElement("div", {
        className: "feedback-criterion-wrapper"
      }, React.createElement("h3", null, this.state.criteria[i].criterion), React.createElement("p", null, "Description: ", this.state.criteria[i].description)), this.state.feedback[i].data.map((val, x) => React.createElement("div", {
        className: "feedback-subwrapper"
      }, React.createElement("h3", null, "Feedback by ", this.state.feedback[i].data[x].reviewerTier, ":"), React.createElement("p", null, "Marks Given: ", this.state.feedback[i].data[x].marksGiven, " / ", this.state.criteria[i].marksMax), this.state.feedback[i].data[x].boundary, React.createElement("p", {
        className: "feedback-textual padding-0810"
      }, "Comments: ", this.state.feedback[i].data[x].comments))))));
    }
  }

}

;

class ReviewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewerId: props.reviewData.reviewerId,
      reviews: props.reviewData.reviews
    };
  }

  render() {
    for (let i = 0; i < this.state.reviews.length; i++) {
      this.state.reviews[i].completedReview = this.state.reviews[i].completedReview === 1 ? React.createElement("span", {
        className: "far fa-check-circle"
      }) : React.createElement("span", {
        className: "far fa-times-circle"
      });
    } // view review just loads it into boxes
    // when in reviewdata groups work out if it should be a completed tick or a x


    if (this.state.reviews.length === 0) {
      return React.createElement("div", {
        id: "review-box",
        className: "review-container"
      }, React.createElement("p", {
        className: "txt-l1 default-msg"
      }, "No reviews to do as of now."));
    } else {
      return React.createElement("div", {
        id: "review-box",
        className: "review-container"
      }, React.createElement("div", {
        className: "asgmt-title"
      }, React.createElement("h2", null, "Review Peers")), this.state.reviews.map((val, i) => React.createElement("div", {
        key: i.toString(),
        className: "cmpnt-container-l padding-0810"
      }, React.createElement("section", {
        className: "cmpnt-name"
      }, React.createElement("h1", null, "#", i + 1)), React.createElement("div", {
        className: "cmpnt-seperator"
      }), React.createElement("section", {
        className: "cmpnt-info-l alt-end"
      }, React.createElement("a", {
        onClick: () => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI),
        className: "review-btn"
      }, "Review Work"), React.createElement("a", {
        onClick: () => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI),
        className: "review-btn"
      }, "Edit Review"), React.createElement("a", {
        onClick: () => renderReview(this.state.reviews[i].submitorId, this.state.reviews[i].submissionURI),
        className: "review-btn"
      }, "View Review"), React.createElement("p", null, "Completed: ", this.state.reviews[i].completedReview)))));
    }
  }

}

;
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
  const content = React.createElement(ReviewingContainer, {
    reviewerId: reviewData.reviewerId,
    submitorId: reviewData.submitorId,
    submissionURI: reviewData.submissionURI,
    criteria: reviewData.form,
    data: reviewData.data
  });
  ReactDOM.render(content, document.getElementById('review-criteria-container'));
  loadReview();
}

;

async function renderFeedbackGiven(userId, userName, criteria) {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('classId');
  const asgmtId = urlParams.get('asgmtId');
  const reviews = await fetch('/api/assignment/reviews/given?classId=' + classId + '&asgmtId=' + asgmtId + '&userId=' + userId, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const reviewsData = await reviews.json();

  if (reviewsData.status === 'fail') {
    renderMessage(reviewsData);
  } else {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
    const modal = React.createElement(ModalContainer, {
      modal: React.createElement(ReviewsGivenModal, {
        reviewsData: reviewsData,
        submitor: userName,
        criteria: criteria
      })
    });
    ReactDOM.render(modal, document.getElementById('modal-container'));
    openModal();
  }
}

;

async function renderFeedbackTaken(userId, userName, criteria) {
  const urlParams = new URLSearchParams(window.location.search);
  const classId = urlParams.get('classId');
  const asgmtId = urlParams.get('asgmtId');
  const reviews = await fetch('/api/assignment/reviews/recieved?classId=' + classId + '&asgmtId=' + asgmtId + '&userId=' + userId, {
    method: 'GET',
    credentials: 'include',
    cache: 'default'
  });
  const reviewsData = await reviews.json();

  if (reviewsData.status === 'fail') {
    renderMessage(reviewsData);
  } else {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
    const modal = React.createElement(ModalContainer, {
      modal: React.createElement(ReviewsTakenModal, {
        reviewsData: reviewsData,
        submitor: userName,
        criteria: criteria
      })
    });
    ReactDOM.render(modal, document.getElementById('modal-container'));
    openModal();
  }
}

; //----- Functions used to perform operations on UI components

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