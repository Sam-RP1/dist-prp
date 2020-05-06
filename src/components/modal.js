'use strict'; //------------- GLOBAL VARIABLES -------------//
// Renderers
//----- General

async function renderMessage(data) {
  const message = React.createElement(Message, {
    msg: data.msg
  });
  const container = document.getElementById('msg-container');
  const col = data.status === 'success' ? "#00bb2d" : "#f54646";
  container.style.backgroundColor = col;
  ReactDOM.render(message, document.getElementById('msg-container'));
  openMessage();
}

;

async function renderInfoModal() {
  const modal = React.createElement(ModalContainer, {
    modal: React.createElement(InfoModal, null)
  });
  openModal();
  ReactDOM.render(modal, document.getElementById('modal-container'));
}

;

async function renderUserManual() {
  const request = "/api/user/manual/view";
  ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
  const modal = React.createElement(ModalContainer, {
    modal: React.createElement(ManualModal, {
      URI: request
    })
  });
  ReactDOM.render(modal, document.getElementById('modal-container'));
  openModal();
}

; //----- Dashboard modals

async function renderCreateClassModal() {
  const modal = React.createElement(ModalContainer, {
    modal: React.createElement(CreateClassModal, null)
  });
  openModal();
  ReactDOM.render(modal, document.getElementById('modal-container'));
}

;

async function renderJoinClassModal() {
  const modal = React.createElement(ModalContainer, {
    modal: React.createElement(JoinClassModal, null)
  });
  openModal();
  ReactDOM.render(modal, document.getElementById('modal-container'));
}

; //----- Classes modals

async function renderClassDetailsModal() {
  const modal = React.createElement(ModalContainer, {
    modal: React.createElement(ClassDetailsModal, null)
  });
  openModal();
  ReactDOM.render(modal, document.getElementById('modal-container'));
}

;

async function renderCreateAssignmentModal() {
  const modal = React.createElement(ModalContainer, {
    modal: React.createElement(CreateAssignmentModal, null)
  });
  openModal();
  ReactDOM.render(modal, document.getElementById('modal-container'));
}

; //----- Assignment modals

async function renderSubmission(userSubmission, userName) {
  const submissionURI = userSubmission === null ? null : "/api/assignment/view/" + userSubmission;

  if (submissionURI === null) {
    renderMessage({
      status: 'fail',
      msg: 'This user has not submitted.'
    });
  } else {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
    const modal = React.createElement(ModalContainer, {
      modal: React.createElement(SubmissionModal, {
        submissionURI: submissionURI,
        submitor: userName
      })
    });
    openModal();
    ReactDOM.render(modal, document.getElementById('modal-container'));
  }
}

;

class ReviewsGivenModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.submitor,
      reviews: props.reviewsData,
      criteria: props.criteria
    };
  }

  render() {
    for (let i = 0; i < this.state.reviews.length; i++) {
      const selectedBoundary = this.state.reviews[i].boundary;

      if (selectedBoundary === 1) {
        this.state.reviews[i].boundary = React.createElement("div", {
          class: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          }
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work very clearly meets the criterion.")));
      } else if (selectedBoundary === 2) {
        this.state.reviews[i].boundary = React.createElement("div", {
          class: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          }
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work very clearly meets the criterion.")));
      } else if (selectedBoundary === 3) {
        this.state.reviews[i].boundary = React.createElement("div", {
          class: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          }
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work very clearly meets the criterion.")));
      } else {
        this.state.reviews[i].boundary = React.createElement("div", {
          class: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          }
        }, React.createElement("p", null, "Work very clearly meets the criterion.")));
      }

      for (let x = 0; x < this.state.criteria.length; x++) {
        if (this.state.reviews[i].criteriaNum === x + 1) {
          this.state.reviews[i].criterion = this.state.criteria[x].criterion;
          this.state.reviews[i].description = this.state.criteria[x].description;
        }
      }
    }

    return React.createElement("div", {
      className: "modal reviews-modal padding-default"
    }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
      id: "modal-title",
      className: "modal-title"
    }, this.state.user, "'s Feedback Given"), React.createElement("div", {
      className: "asgmt-criteria"
    }, this.state.reviews.map((val, i) => React.createElement("div", {
      className: "criteria-container"
    }, React.createElement("h3", null, this.state.criteria[i].criterion, ":"), React.createElement("p", null, this.state.criteria[i].description), React.createElement("p", null, "Marks: ", this.state.reviews[i].marksGiven, " / ", this.state.reviews[i].marksMax), React.createElement("p", null, "Comments: ", this.state.reviews[i].comments), this.state.reviews[i].boundary))));
  }

}

;

class ReviewsTakenModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.submitor,
      reviews: props.reviewsData,
      criteria: props.criteria
    };
    console.log(this.state);
  }

  render() {
    for (let i = 0; i < this.state.reviews.length; i++) {
      const selectedBoundary = this.state.reviews[i].boundary;

      if (selectedBoundary === 1) {
        this.state.reviews[i].boundary = React.createElement("div", {
          class: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          }
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work very clearly meets the criterion.")));
      } else if (selectedBoundary === 2) {
        this.state.reviews[i].boundary = React.createElement("div", {
          class: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          }
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work very clearly meets the criterion.")));
      } else if (selectedBoundary === 3) {
        this.state.reviews[i].boundary = React.createElement("div", {
          class: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          }
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work very clearly meets the criterion.")));
      } else {
        this.state.reviews[i].boundary = React.createElement("div", {
          class: "mark-boundaries"
        }, React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work does not meet the criterion.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work meets some aspects of the criterion, but not all.")), React.createElement("div", {
          className: "boundary"
        }, React.createElement("p", null, "Work mostly meets the criterion.")), React.createElement("div", {
          className: "boundary",
          style: {
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(20, 120, 250)"
          }
        }, React.createElement("p", null, "Work very clearly meets the criterion.")));
      }

      for (let x = 0; x < this.state.criteria.length; x++) {
        if (this.state.reviews[i].criteriaNum === x + 1) {
          this.state.reviews[i].criterion = this.state.criteria[x].criterion;
          this.state.reviews[i].description = this.state.criteria[x].description;
        }
      }
    }

    return React.createElement("div", {
      className: "modal reviews-modal padding-default"
    }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
      id: "modal-title",
      className: "modal-title"
    }, this.state.user, "'s Feedback Recieved"), React.createElement("div", {
      className: "asgmt-criteria"
    }, this.state.reviews.map((val, i) => React.createElement("div", {
      className: "criteria-container"
    }, React.createElement("h3", null, this.state.reviews[i].criterion, ":"), React.createElement("p", null, this.state.reviews[i].description), React.createElement("p", null, "Marks: ", this.state.reviews[i].marksGiven, " / ", this.state.reviews[i].marksMax), React.createElement("p", null, "Comments: ", this.state.reviews[i].comments), this.state.reviews[i].boundary))));
  }

}

; // Forms

class CreateClassForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '',
      unitCode: ''
    };
    this.validate = this.validate.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  async submitHandler(event) {
    event.preventDefault();
    const result = await this.validate(this.state);

    if (result === true) {
      const response = await fetch('/api/class/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          class: {
            name: this.state.className,
            unitCode: this.state.unitCode
          }
        })
      });
      const data = await response.json();

      if (data.status === 'success') {
        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
        await dashboardContents();
        hideHiddenClasses();
      }

      renderMessage(data);
      closeModal();
    } else {
      const err = document.getElementById('modal-msg');
      err.style.display = "flex";
    }
  }

  validate(data) {
    const err = document.getElementById('modal-msg');
    err.style.display = "none";

    if (/^[a-zA-Z0-9 ]*$/.test(data.className) === false) {
      err.textContent = "The class name must contain only letters and numbers. Please change this before attempting to submit again.";
      return false;
    }

    if (/^[a-zA-Z0-9]*$/.test(data.unitCode) === false) {
      err.textContent = "The unit code must contain only letters and numbers. Please change this before attempting to submit again.";
      return false;
    }

    return true;
  }

  changeHandler(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return React.createElement("form", {
      onSubmit: this.submitHandler
    }, React.createElement("p", null, "Class Name:", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "text",
      name: "className",
      value: this.state.value,
      onChange: this.changeHandler,
      placeholder: "Enter Class Name Here (Required)",
      minLength: "4",
      maxLength: "20",
      required: true
    })), React.createElement("p", null, "Unit Code:", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "text",
      name: "unitCode",
      value: this.state.value,
      onChange: this.changeHandler,
      placeholder: "Enter Unit Code Here",
      minLength: "4",
      maxLength: "10",
      required: true
    })), React.createElement("input", {
      className: "modal-btn",
      type: "submit",
      value: "Submit"
    }));
  }

}

;

class JoinClassForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classCode: ''
    };
    this.validate = this.validate.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  async submitHandler(event) {
    event.preventDefault();
    const result = await this.validate(this.state);

    if (result === true) {
      const response = await fetch('/api/class/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.state.classCode
        })
      });
      const data = await response.json();

      if (data.status === 'success') {
        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
        await dashboardContents();
        hideHiddenClasses();
      }

      renderMessage(data);
      closeModal();
    } else {
      const err = document.getElementById('modal-msg');
      err.style.display = "flex";
    }
  }

  validate(data) {
    const err = document.getElementById('modal-msg');
    err.style.display = "none";

    if (/^[a-zA-Z0-9]*$/.test(data.classCode) === false) {
      err.textContent = "The name you have entered must contain only letters and numbers. Please change this before attempting to submit again.";
      return false;
    }

    return true;
  }

  changeHandler(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return React.createElement("form", {
      onSubmit: this.submitHandler
    }, React.createElement("input", {
      className: "modal-input-max",
      type: "text",
      name: "classCode",
      value: this.state.value,
      onChange: this.changeHandler,
      placeholder: "Enter Class Code Here",
      minLength: "8",
      maxLength: "8",
      required: true
    }), React.createElement("input", {
      className: "modal-btn",
      type: "submit",
      value: "Submit"
    }));
  }

}

;

class CreateAssignmentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      criteria: [{
        criterion: '',
        criterionDescription: '',
        criterionMarks: ''
      }],
      asgmtName: '',
      asgmtDesc: '',
      asgmtWorkDue: '',
      asgmtReviewsDue: '',
      asgmtNumReviews: '',
      asgmtResource1: '',
      asgmtResource2: '',
      asgmtResource3: '',
      asgmtFiles: [null, null, null]
    };
    this.reset = this.reset.bind(this);
    this.addCriterion = this.addCriterion.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.validate = this.validate.bind(this);
  }

  async reset() {
    await this.setState({
      criteria: [{
        criterion: '',
        criterionDescription: '',
        criterionMarks: ''
      }],
      asgmtName: '',
      asgmtDesc: '',
      asgmtWorkDue: '',
      asgmtReviewsDue: '',
      asgmtNumReviews: '',
      asgmtResource1: '',
      asgmtResource2: '',
      asgmtResource3: '',
      asgmtFiles: [null, null, null]
    });
  }

  addCriterion() {
    this.setState(prevState => ({
      criteria: [...prevState.criteria, {
        criterion: '',
        criterionDescription: '',
        criterionMarks: ''
      }]
    }));
  }

  async fileHandler(event) {
    let files = [...this.state.asgmtFiles];

    if (event.target.name === 'asgmtFile1') {
      if (!event.target.files[0]) {
        files[0] = null;
      } else {
        files[0] = event.target.files[0];
      }
    } else if (event.target.name === 'asgmtFile2') {
      if (!event.target.files[0]) {
        files[1] = null;
      } else {
        files[1] = event.target.files[0];
      }
    } else {
      if (!event.target.files[0]) {
        files[2] = null;
      } else {
        files[2] = event.target.files[0];
      }
    }

    await this.setState({
      asgmtFiles: files
    });
  }

  async changeHandler(event) {
    if (['criterion', 'criterionDescription', 'criterionMarks'].includes(event.target.className)) {
      let criteria = [...this.state.criteria];
      criteria[event.target.dataset.id][event.target.className] = event.target.value;
      await this.setState({
        criteria
      });
    } else {
      await this.setState({
        [event.target.name]: event.target.value
      });
    }
  }

  async submitHandler(event) {
    event.preventDefault();
    const result = await this.validate(this.state);

    if (result === true) {
      const urlParams = new URLSearchParams(window.location.search);
      const response = await fetch('/api/assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          classId: urlParams.get('classId'),
          assignment: this.state
        })
      });
      const data = await response.json();

      if (data.status === 'success') {
        const fileData = new FormData();

        for (let i = 0; i < this.state.asgmtFiles.length; i++) {
          fileData.append('files', this.state.asgmtFiles[i]);
        }

        const uploadResponse = await fetch('/api/assignment/upload/' + urlParams.get('classId') + '/' + data.id, {
          method: 'POST',
          body: fileData
        });
        const uploadData = await uploadResponse.json();

        if (uploadData.status === 'success') {
          ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
          await getClassContents();
        }
      }

      renderMessage(data);
      closeModal();
    } else {
      const err = document.getElementById('modal-msg');
      err.style.display = "flex";
    }
  }

  validate(data) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    const err = document.getElementById('modal-msg');
    err.style.display = "none";

    if (/^[a-zA-Z0-9 ]*$/.test(data.asgmtName) === false) {
      err.textContent = "The assignment name you choose must contain only letters and numbers. Please change this before attempting to submit again.";
      return false;
    }

    if (new Date(data.asgmtWorkDue) < today) {
      err.textContent = "The assignment work due date you choose must be in the future. Please change this before attempting to submit again.";
      return false;
    }

    if (new Date(data.asgmtReviewsDue) < today) {
      err.textContent = "The assignment reviews due date you choose must be in the future. Please change this before attempting to submit again.";
      return false;
    }

    if (new Date(data.asgmtReviewsDue) < new Date(data.asgmtWorkDue)) {
      err.textContent = "The assignment reviews due date you choose must be after the date you have chosen for the work due date. Please change this before attempting to submit again.";
      return false;
    } // File validation


    if (data.asgmtFiles[0].type !== "application/pdf") {
      err.textContent = "The first file you have chosen to upload is not a PDF. Please make sure that all attached files are in the PDF format before attempting to submit again.";
      return false;
    }

    if (data.asgmtFiles[1] !== null) {
      if (data.asgmtFiles[1].type !== "application/pdf") {
        err.textContent = "The second file you have chosen to upload is not a PDF. Please make sure that all attached files are in the PDF format before attempting to submit again.";
        return false;
      }

      if (data.asgmtFiles[0].name === data.asgmtFiles[1].name && data.asgmtFiles[0].size === data.asgmtFiles[1].size && data.asgmtFiles[0].lastModified === data.asgmtFiles[1].lastModified) {
        err.textContent = "The first and second files you have attached are the same. Please make sure these files are different before attempting to submit again.";
        return false;
      }
    }

    if (data.asgmtFiles[2] !== null) {
      if (data.asgmtFiles[2].type !== "application/pdf") {
        err.textContent = "The third file you have chosen to upload is not a PDF. Please make sure that all attached files are in the PDF format before attempting to submit again.";
        return false;
      }

      if (data.asgmtFiles[0].name === data.asgmtFiles[2].name && data.asgmtFiles[0].size === data.asgmtFiles[2].size && data.asgmtFiles[0].lastModified === data.asgmtFiles[2].lastModified) {
        err.textContent = "The first and third files you have attached are the same. Please make sure these files are different before attempting to submit again.";
        return false;
      }

      if (data.asgmtFiles[1] !== null) {
        if (data.asgmtFiles[1].name === data.asgmtFiles[2].name && data.asgmtFiles[1].size === data.asgmtFiles[2].size && data.asgmtFiles[1].lastModified === data.asgmtFiles[2].lastModified) {
          err.textContent = "The second and third files you have attached are the same. Please make sure these files are different before attempting to submit again.";
          return false;
        }
      }
    }

    for (let i = 0; i < data.criteria.length; i++) {
      if (/^[a-zA-Z0-9 ]*$/.test(data.criteria[i].criterion) == false) {
        err.textContent = "Criterions must contain only letters and numbers, criterion " + (i + 1) + " needs to be corrected. Please change this before attempting to submit again.";
        return false;
      }
    }

    return true;
  }

  render() {
    let {
      criteria
    } = this.state;
    return React.createElement("form", {
      id: "create-assignment-form",
      onSubmit: this.submitHandler
    }, React.createElement("p", null, "Name:", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "text",
      name: "asgmtName",
      onChange: this.changeHandler,
      value: this.state.value,
      placeholder: "Enter Assignment Name Here",
      minLength: "4",
      maxLength: "20",
      required: true
    })), React.createElement("p", null, "Description:", React.createElement("textarea", {
      className: "modal-input-description-box-alt",
      type: "text",
      name: "asgmtDesc",
      onChange: this.changeHandler,
      value: this.state.value,
      placeholder: "Enter Description Here",
      minLength: "4",
      maxLength: "1000",
      required: true
    })), React.createElement("p", null, "Work Due:", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "date",
      name: "asgmtWorkDue",
      onChange: this.changeHandler,
      value: this.state.value,
      placeholder: "Date Here",
      required: true
    })), React.createElement("p", null, "Reviews Due:", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "date",
      name: "asgmtReviewsDue",
      onChange: this.changeHandler,
      value: this.state.value,
      placeholder: "Date Here",
      required: true
    })), React.createElement("p", null, "# of Reviews:", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "number",
      min: "1",
      max: "20",
      name: "asgmtNumReviews",
      onChange: this.changeHandler,
      value: this.state.value,
      placeholder: "Number Here",
      minLength: "1",
      maxLength: "2",
      required: true
    })), React.createElement("p", null, "Resources:", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "text",
      name: "asgmtResource1",
      onChange: this.changeHandler,
      value: this.state.value,
      placeholder: "Resources #1 URL/Reference",
      minLength: "4",
      maxLength: "150",
      required: true
    })), React.createElement("p", null, "-", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "text",
      name: "asgmtResource2",
      onChange: this.changeHandler,
      value: this.state.value,
      placeholder: "Resources #2 URL/Reference",
      minLength: "4",
      maxLength: "150"
    })), React.createElement("p", null, "-", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "text",
      name: "asgmtResource3",
      onChange: this.changeHandler,
      value: this.state.value,
      placeholder: "Resources #3 URL/Reference",
      minLength: "4",
      maxLength: "150"
    })), React.createElement("p", null, "Attach Files:", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "file",
      name: "asgmtFile1",
      onChange: this.fileHandler,
      value: this.state.value,
      placeholder: "Marking Guide",
      minLength: "4",
      maxLength: "100",
      required: true
    })), React.createElement("p", null, "-", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "file",
      name: "asgmtFile2",
      onChange: this.fileHandler,
      value: this.state.value,
      placeholder: "File #2",
      minLength: "4",
      maxLength: "100"
    })), React.createElement("p", null, "-", React.createElement("input", {
      className: "modal-input-max-alt",
      type: "file",
      name: "asgmtFile3",
      onChange: this.fileHandler,
      value: this.state.value,
      placeholder: "File #3",
      minLength: "4",
      maxLength: "100"
    })), React.createElement("p", null, "Create the assignments review feedback form..."), criteria.map((val, idx) => {
      let criterionId = `criterion-${idx}`,
          criterionDescriptionId = `criterionDescription-${idx}`,
          criterionMarksId = `criterionMarks-${idx}`;
      return React.createElement("div", {
        key: idx,
        className: "criterion-wrapper"
      }, React.createElement("p", null, "Criterion ", idx + 1, ":", React.createElement("input", {
        className: "criterion",
        type: "text",
        name: criterionId,
        "data-id": idx,
        id: criterionId,
        onChange: this.changeHandler,
        value: criteria[idx].criterion,
        placeholder: "Criterion Here",
        minLength: "4",
        maxLength: "20",
        required: true
      })), React.createElement("p", null, "- Description:", React.createElement("textarea", {
        className: "criterionDescription",
        type: "text",
        name: criterionDescriptionId,
        "data-id": idx,
        id: criterionDescriptionId,
        onChange: this.changeHandler,
        value: criteria[idx].criterionDescription,
        placeholder: "Enter an optional description here",
        minLength: "4",
        maxLength: "500"
      })), React.createElement("p", null, "- Marks:", React.createElement("input", {
        className: "criterionMarks",
        type: "number",
        min: "1",
        max: "100",
        name: criterionMarksId,
        "data-id": idx,
        id: criterionMarksId,
        onChange: this.changeHandler,
        value: criteria[idx].criterionMarks,
        placeholder: "Number of Marks Here",
        required: true
      })));
    }), React.createElement("div", {
      className: "modal-btn-wrapper"
    }, React.createElement("input", {
      className: "modal-btn",
      type: "reset",
      value: "Reset",
      onClick: () => this.reset()
    }), React.createElement("input", {
      className: "modal-btn",
      type: "button",
      onClick: () => this.addCriterion(),
      value: "Add criterion"
    }), React.createElement("input", {
      className: "modal-btn",
      type: "submit",
      value: "Submit"
    })));
  }

}

; // React Fragments

function ModalContainer(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "overlay"
  }), React.createElement("div", {
    className: "modal-wrapper padding-default"
  }, props.modal));
}

;

function InfoModal(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "modal default-size padding-default"
  }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
    id: "modal-title",
    className: "modal-title"
  }, "Information & Help"), React.createElement("div", {
    className: "collapsible-container"
  }, React.createElement("button", {
    id: "coll-1",
    onClick: () => toggleCollapsible("coll-1"),
    type: "button",
    className: "collapsible-btn transition-01"
  }, "Peer Review Help Guide"), React.createElement("div", {
    className: "collapsible-txt"
  }, React.createElement("p", null, "There are many ways to improve the feedback you provide a peer when you review their work. Below are five quick and easy points that you can use to improve the peer reviews you do."), React.createElement("p", null, "1. Make sure you fully understand the marking criteria ", React.createElement("strong", null, "before"), " you begin peer reviewing work. If you do not understand what you are meant to be looking for or critiquing in the work you are reviewing then you are not able to provide accurate, reliable and trust worthy feedback. If you need to, look for some support that can help you better understand the marking criteria."), React.createElement("p", null, "2. Always thoroughly read the work you are reviewing. Be critical and do not ignore the details of the work you are reviewing, be sure to not skim read over parts as these may contain crucial errors or mistakes that the author of the work needs informing about from your peer review feedback. If necessary take notes of the work as you are reading through it and note down the major, moderate and minor errors and where they are located."), React.createElement("p", null, "3. Always be specific in your feedback. When typing out the feedback do not be open ended, the more specific you can be about a problem the easier the author can locate it and start ammending it."), React.createElement("p", null, "4. Always explain the feedback you give. Do not just say what you think you have identified in thier work is an error or a problem or could be improved. Explain why it is error using evidence to backup the point you are making, explain why it is a problem using examples, explain why it could be improved and how it could be improved. The more scientific and concise the explanations you provide in your feedback the easier it is for the works author to improve their work."), React.createElement("p", null, "5. Try to provide feedback that is easy to understand when peer reviewing work. The less complex and the more concise the feedback you give the easier it will be for the works author to understand.")), React.createElement("button", {
    id: "coll-2",
    onClick: () => toggleCollapsible("coll-2"),
    type: "button",
    className: "collapsible-btn transition-01"
  }, "Website Help Guide"), React.createElement("div", {
    className: "collapsible-txt"
  }, React.createElement("p", null, "For help using the Peer Review Platform click the link below to open the user manual..."), React.createElement("a", {
    onClick: () => renderUserManual(),
    className: "cmpnt-btn-l asgmt-cmpnt-btn-l addon-m-10w"
  }, React.createElement("p", null, "View Manual"))))));
}

;

function CreateClassModal(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "modal create-class padding-default"
  }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
    id: "modal-title",
    className: "modal-title"
  }, "Create a new class by entering the following below."), React.createElement("p", {
    id: "modal-msg",
    className: "modal-msg"
  }), React.createElement(CreateClassForm, null)));
}

;

function JoinClassModal(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "modal join-class padding-default"
  }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
    id: "modal-title",
    className: "modal-title"
  }, "Join a new class by entering the code you have been given below."), React.createElement("p", {
    id: "modal-msg",
    className: "modal-msg"
  }), React.createElement(JoinClassForm, null)));
}

;

function ClassDetailsModal(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "overlay"
  }), React.createElement("div", {
    className: "modal-wrapper padding-default"
  }, React.createElement("div", {
    className: "modal default-size padding-default"
  }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
    id: "modal-title",
    className: "modal-title"
  }, "Details: ", classDetails.className), React.createElement("div", {
    className: "class-details-container"
  }, React.createElement("p", null, "Unit Code: ", classDetails.classUnitCode), React.createElement("p", null, "Number of Assignments: ", classDetails.numAssignments), React.createElement("p", null, "- Active Assignments: ", classDetails.numActiveAssignments), React.createElement("p", null, "- Past Assignments: ", classDetails.numPastAssignments), React.createElement("p", null, "Number of Students: ", classDetails.classSize)), React.createElement("h2", {
    className: "modal-title"
  }, "Class Register:"), React.createElement("div", {
    className: "class-register-container"
  }, classDetails.classRegister.map((name, i) => React.createElement("div", {
    key: i.toString(),
    className: "student-details-wrapper"
  }, React.createElement("p", null, i + 1, ": ", classDetails.classRegister[i].name), React.createElement("p", null, "- Email: ", classDetails.classRegister[i].email)))))));
}

;

function CreateAssignmentModal(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "modal create-assignment padding-default"
  }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
    id: "modal-title",
    className: "modal-title"
  }, "Create a new assignment by filling in the following..."), React.createElement("p", {
    id: "modal-msg",
    className: "modal-msg"
  }), React.createElement(CreateAssignmentForm, null)));
}

;

function SubmissionModal(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "modal submission padding-default"
  }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
    id: "modal-title",
    className: "modal-title"
  }, props.submitor, "'s submission"), React.createElement("iframe", {
    src: props.submissionURI,
    frameborder: "0"
  })));
}

function ManualModal(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "modal submission padding-default"
  }, React.createElement(ModalBackBtn, null), React.createElement("h2", {
    id: "modal-title",
    className: "modal-title"
  }, "Peer Review Portal User Manual"), React.createElement("iframe", {
    src: props.URI,
    frameborder: "0"
  })));
}

function Message(props) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "msg-content"
  }, React.createElement(MessageCloseBtn, null), React.createElement("p", {
    className: "msg-text"
  }, props.msg)));
}

; // Message functions

function openMessage() {
  document.getElementById('msg-container').style.top = "0px";
}

function closeMessage() {
  ReactDOM.unmountComponentAtNode(document.getElementById('msg-container'));
  document.getElementById('msg-container').style.top = "-60px";
}

function MessageCloseBtn() {
  return React.createElement("div", {
    className: "msg-close-btn pointer"
  }, React.createElement("span", {
    onClick: closeMessage,
    className: "fas fa-times-circle"
  }));
} // Modal Binds
//----- Used to perform open and close operations on the modals


function openModal() {
  document.getElementById('modal-container').style.display = "flex";
}

;

function closeModal() {
  ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
  document.getElementById('modal-container').style.display = "none";
}

;

function toggleCollapsible(id) {
  const coll = document.getElementById(id);
  const content = coll.nextElementSibling;
  coll.classList.toggle("collapsible-active");

  if (content.style.height) {
    content.style.height = null;
  } else {
    content.style.height = content.scrollHeight + "px";
  }
}

; // Modal Buttons

function ModalBackBtn(props) {
  return React.createElement("div", {
    className: "modal-back-btn"
  }, React.createElement("span", {
    onClick: closeModal,
    className: "fas fa-chevron-left"
  }, React.createElement("p", {
    className: "modal-back-btn-txt"
  }, "back")));
}

;