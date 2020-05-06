'use strict';

//------------- GLOBAL VARIABLES -------------//

// Renderers
//----- General
async function renderMessage(data) {
  const message = <Message msg={data.msg} />;
  const container = document.getElementById('msg-container');
  const col = (data.status === 'success') ? "#00bb2d" : "#f54646";
  container.style.backgroundColor = col;
  ReactDOM.render(
    message,
    document.getElementById('msg-container')
  );
  openMessage();
};
async function renderInfoModal() {
  const modal = <ModalContainer modal=<InfoModal /> />
  openModal();
  ReactDOM.render(
    modal,
    document.getElementById('modal-container')
  );
};
//----- Dashboard modals
async function renderCreateClassModal() {
  const modal = <ModalContainer modal=<CreateClassModal /> />
  openModal();
  ReactDOM.render(
    modal,
    document.getElementById('modal-container')
  );
};
async function renderJoinClassModal() {
  const modal = <ModalContainer modal=<JoinClassModal /> />
  openModal();
  ReactDOM.render(
    modal,
    document.getElementById('modal-container')
  );
};
//----- Classes modals
async function renderClassDetailsModal() {
  const modal = <ModalContainer modal=<ClassDetailsModal /> />
  openModal();
  ReactDOM.render(
    modal,
    document.getElementById('modal-container')
  );
};
async function renderCreateAssignmentModal() {
  const modal = <ModalContainer modal=<CreateAssignmentModal /> />
  openModal();
  ReactDOM.render(
    modal,
    document.getElementById('modal-container')
  );
};
//----- Assignment modals
async function renderSubmission(userSubmission, userName) {
  const submissionURI = (userSubmission === null) ? null : "/api/assignment/view/" + userSubmission;

  if (submissionURI === null) {
    renderMessage({ status: 'fail', msg: 'This user has not submitted.' })
  } else {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
    const modal = <ModalContainer modal=<SubmissionModal submissionURI={submissionURI} submitor={userName} /> />
    openModal();
    ReactDOM.render(
      modal,
      document.getElementById('modal-container')
    );
  }
};
class ReviewsGivenModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.submitor,
      reviews: props.reviewsData,
      criteria: props.criteria
    }
  }

  render () {
    for (let i = 0; i < this.state.reviews.length; i++) {
      const selectedBoundary = this.state.reviews[i].boundary;
      if (selectedBoundary === 1) {
        this.state.reviews[i].boundary = (
          <div class="mark-boundaries">
          <div className="boundary" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}}>
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
      } else if (selectedBoundary === 2) {
        this.state.reviews[i].boundary = (
          <div class="mark-boundaries">
          <div className="boundary">
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}}>
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
      } else if (selectedBoundary === 3) {
        this.state.reviews[i].boundary = (
          <div class="mark-boundaries">
          <div className="boundary">
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary">
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}}>
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary">
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      } else {
        this.state.reviews[i].boundary = (
          <div class="mark-boundaries">
          <div className="boundary">
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary">
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary">
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}}>
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      }

      for (let x = 0; x < this.state.criteria.length; x++) {
        if (this.state.reviews[i].criteriaNum === (x+1)) {
          this.state.reviews[i].criterion = this.state.criteria[x].criterion;
          this.state.reviews[i].description = this.state.criteria[x].description;
        }
      }
    }
    return (
      <div className="modal reviews-modal padding-default">
      <ModalBackBtn />
      <h2 id="modal-title" className="modal-title">{this.state.user}'s Feedback Given</h2>
      <div className="asgmt-criteria">
      {this.state.reviews.map((val, i) =>
        <div className="criteria-container">
        <h3>{this.state.criteria[i].criterion}:</h3>
        <p>{this.state.criteria[i].description}</p>
        <p>Marks: {this.state.reviews[i].marksGiven} / {this.state.reviews[i].marksMax}</p>
        <p>Comments: {this.state.reviews[i].comments}</p>
        {this.state.reviews[i].boundary}
        </div>
      )}
      </div>
      </div>
    )
  }
};
class ReviewsTakenModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.submitor,
      reviews: props.reviewsData,
      criteria: props.criteria
    }
    console.log(this.state)
  }

  render () {
    for (let i = 0; i < this.state.reviews.length; i++) {
      const selectedBoundary = this.state.reviews[i].boundary;
      if (selectedBoundary === 1) {
        this.state.reviews[i].boundary = (
          <div class="mark-boundaries">
          <div className="boundary" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}}>
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
      } else if (selectedBoundary === 2) {
        this.state.reviews[i].boundary = (
          <div class="mark-boundaries">
          <div className="boundary">
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}}>
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
      } else if (selectedBoundary === 3) {
        this.state.reviews[i].boundary = (
          <div class="mark-boundaries">
          <div className="boundary">
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary">
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}}>
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary">
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      } else {
        this.state.reviews[i].boundary = (
          <div class="mark-boundaries">
          <div className="boundary">
          <p>Work does not meet the criterion.</p>
          </div>
          <div className="boundary">
          <p>Work meets some aspects of the criterion, but not all.</p>
          </div>
          <div className="boundary">
          <p>Work mostly meets the criterion.</p>
          </div>
          <div className="boundary" style={{color: "rgb(255, 255, 255)", backgroundColor: "rgb(20, 120, 250)"}}>
          <p>Work very clearly meets the criterion.</p>
          </div>
          </div>
        )
      }

      for (let x = 0; x < this.state.criteria.length; x++) {
        if (this.state.reviews[i].criteriaNum === (x+1)) {
          this.state.reviews[i].criterion = this.state.criteria[x].criterion;
          this.state.reviews[i].description = this.state.criteria[x].description;
        }
      }
    }
    return (
      <div className="modal reviews-modal padding-default">
      <ModalBackBtn />
      <h2 id="modal-title" className="modal-title">{this.state.user}'s Feedback Recieved</h2>
      <div className="asgmt-criteria">
      {this.state.reviews.map((val, i) =>
        <div className="criteria-container">
        <h3>{this.state.reviews[i].criterion}:</h3>
        <p>{this.state.reviews[i].description}</p>
        <p>Marks: {this.state.reviews[i].marksGiven} / {this.state.reviews[i].marksMax}</p>
        <p>Comments: {this.state.reviews[i].comments}</p>
        {this.state.reviews[i].boundary}
        </div>
      )}
      </div>
      </div>
    )
  }
};

// Forms
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
        headers: { 'Content-Type' : 'application/json' },
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
      renderMessage(data)
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
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    return (
      <form onSubmit={this.submitHandler}>
      <p>Class Name:
      <input className="modal-input-max-alt" type="text" name="className" value={this.state.value} onChange={this.changeHandler} placeholder="Enter Class Name Here (Required)" minLength="4" maxLength="20" required />
      </p>
      <p>Unit Code:
      <input className="modal-input-max-alt" type="text" name="unitCode" value={this.state.value} onChange={this.changeHandler} placeholder="Enter Unit Code Here" minLength="4" maxLength="10" required />
      </p>
      <input className="modal-btn" type="submit" value="Submit" />
      </form>
    );
  }
};
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
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          id: this.state.classCode
        })
      })
      const data = await response.json();
      if (data.status === 'success') {
        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));
        await dashboardContents();
        hideHiddenClasses();
      }
      renderMessage(data)
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
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return (
      <form onSubmit={this.submitHandler}>
      <input className="modal-input-max" type="text" name="classCode" value={this.state.value} onChange={this.changeHandler} placeholder="Enter Class Code Here" minLength="8" maxLength="8" required />
      <input className="modal-btn" type="submit" value="Submit" />
      </form>
    );
  }
};
class CreateAssignmentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      criteria: [{criterion: '', criterionDescription: '', criterionMarks: ''}],
      asgmtName: '',
      asgmtDesc: '',
      asgmtWorkDue: '',
      asgmtReviewsDue: '',
      asgmtNumReviews: '',
      asgmtResource1: '',
      asgmtResource2: '',
      asgmtResource3: '',
      asgmtFiles: [null, null, null]
    }

    this.reset = this.reset.bind(this);
    this.addCriterion = this.addCriterion.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.validate = this.validate.bind(this);
  };

  async reset() {
    await this.setState({
      criteria: [{criterion: '', criterionDescription: '', criterionMarks: ''}],
      asgmtName: '',
      asgmtDesc: '',
      asgmtWorkDue: '',
      asgmtReviewsDue: '',
      asgmtNumReviews: '',
      asgmtResource1: '',
      asgmtResource2: '',
      asgmtResource3: '',
      asgmtFiles: [null, null, null]
    })
  };

  addCriterion() {
    this.setState((prevState) => ({
      criteria: [...prevState.criteria, {criterion: '', criterionDescription: '', criterionMarks: ''}],
    }));
  };

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
    await this.setState({asgmtFiles: files});
  };

  async changeHandler(event) {
    if (['criterion', 'criterionDescription', 'criterionMarks'].includes(event.target.className)) {
      let criteria = [...this.state.criteria];
      criteria[event.target.dataset.id][event.target.className] = event.target.value;
      await this.setState({ criteria });
    } else {
      await this.setState({[event.target.name]: event.target.value});
    }
  };

  async submitHandler(event) {
    event.preventDefault();
    const result = await this.validate(this.state);

    if (result === true) {
      const urlParams = new URLSearchParams(window.location.search);
      const response = await fetch('/api/assignment', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          classId: urlParams.get('classId'),
          assignment: this.state,
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
      renderMessage(data)
      closeModal();
    } else {
      const err = document.getElementById('modal-msg');
      err.style.display = "flex";
    }
  };

  validate(data) {
    let today = new Date();
    today.setHours(0,0,0,0);
    const err = document.getElementById('modal-msg');
    err.style.display = "none";

    if (/^[a-zA-Z0-9 ]*$/.test(data.asgmtName) === false) {
      err.textContent = "The assignment name you choose must contain only letters and numbers. Please change this before attempting to submit again.";
      return false;
    }
    if ((new Date(data.asgmtWorkDue)) < today) {
      err.textContent = "The assignment work due date you choose must be in the future. Please change this before attempting to submit again.";
      return false;
    }
    if ((new Date(data.asgmtReviewsDue)) < today) {
      err.textContent = "The assignment reviews due date you choose must be in the future. Please change this before attempting to submit again.";
      return false;
    }
    if ((new Date(data.asgmtReviewsDue)) < (new Date(data.asgmtWorkDue))) {
      err.textContent = "The assignment reviews due date you choose must be after the date you have chosen for the work due date. Please change this before attempting to submit again.";
      return false;
    }
    // File validation
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
        err.textContent = "Criterions must contain only letters and numbers, criterion " + (i+1) + " needs to be corrected. Please change this before attempting to submit again.";
        return false;
      }
    }
    return true;
  };

  render() {
    let {criteria} = this.state;
    return (
      <form id="create-assignment-form" onSubmit={this.submitHandler}>
      <p>Name:<input className="modal-input-max-alt" type="text" name="asgmtName" onChange={this.changeHandler} value={this.state.value} placeholder="Enter Assignment Name Here" minLength="4" maxLength="20" required /></p>
      <p>Description:<textarea className="modal-input-description-box-alt" type="text" name="asgmtDesc" onChange={this.changeHandler} value={this.state.value} placeholder="Enter Description Here" minLength="4" maxLength="1000" required /></p>
      <p>Work Due:<input className="modal-input-max-alt" type="date" name="asgmtWorkDue" onChange={this.changeHandler} value={this.state.value} placeholder="Date Here" required /></p>
      <p>Reviews Due:<input className="modal-input-max-alt" type="date" name="asgmtReviewsDue" onChange={this.changeHandler} value={this.state.value} placeholder="Date Here" required /></p>
      <p># of Reviews:<input className="modal-input-max-alt" type="number" min="1" max="20" name="asgmtNumReviews" onChange={this.changeHandler} value={this.state.value} placeholder="Number Here" minLength="1" maxLength="2" required /></p>
      <p>Resources:<input className="modal-input-max-alt" type="text" name="asgmtResource1" onChange={this.changeHandler} value={this.state.value} placeholder="Resources #1 URL/Reference" minLength="4" maxLength="150" required /></p>
      <p>-<input className="modal-input-max-alt" type="text" name="asgmtResource2" onChange={this.changeHandler} value={this.state.value} placeholder="Resources #2 URL/Reference" minLength="4" maxLength="150" /></p>
      <p>-<input className="modal-input-max-alt" type="text" name="asgmtResource3" onChange={this.changeHandler} value={this.state.value} placeholder="Resources #3 URL/Reference" minLength="4" maxLength="150" /></p>
      <p>Attach Files:<input className="modal-input-max-alt" type="file" name="asgmtFile1" onChange={this.fileHandler} value={this.state.value} placeholder="Marking Guide" minLength="4" maxLength="100" required /></p>
      <p>-<input className="modal-input-max-alt" type="file" name="asgmtFile2" onChange={this.fileHandler} value={this.state.value} placeholder="File #2" minLength="4" maxLength="100" /></p>
      <p>-<input className="modal-input-max-alt" type="file" name="asgmtFile3" onChange={this.fileHandler} value={this.state.value} placeholder="File #3" minLength="4" maxLength="100" /></p>
      <p>Create the assignments review feedback form...</p>
      {
        criteria.map((val, idx) => {
          let criterionId = `criterion-${idx}`, criterionDescriptionId = `criterionDescription-${idx}`, criterionMarksId = `criterionMarks-${idx}`
          return (
            <div key={idx} className="criterion-wrapper">
            <p>Criterion {idx+1}:<input className="criterion" type="text" name={criterionId} data-id={idx} id={criterionId} onChange={this.changeHandler} value={criteria[idx].criterion} placeholder="Criterion Here" minLength="4" maxLength="20" required /></p>
            <p>- Description:<textarea className="criterionDescription" type="text" name={criterionDescriptionId} data-id={idx} id={criterionDescriptionId} onChange={this.changeHandler} value={criteria[idx].criterionDescription} placeholder="Enter an optional description here" minLength="4" maxLength="500" /></p>
            <p>- Marks:<input className="criterionMarks" type="number" min="1" max="100" name={criterionMarksId} data-id={idx} id={criterionMarksId} onChange={this.changeHandler} value={criteria[idx].criterionMarks} placeholder="Number of Marks Here" required /></p>
            </div>
          )
        })
      }
      <div className="modal-btn-wrapper">
      <input className="modal-btn" type="reset" value="Reset" onClick={() => this.reset()}/>
      <input className="modal-btn" type="button" onClick={() => this.addCriterion()} value="Add criterion" />
      <input className="modal-btn" type="submit" value="Submit" />
      </div>
      </form>
    );
  };
};

// React Fragments
function ModalContainer(props) {
  return (
    <React.Fragment>
    <div className="overlay"></div>
    <div className="modal-wrapper padding-default">
    {props.modal}
    </div>
    </React.Fragment>
  );
};
function InfoModal(props) {
  return (
    <React.Fragment>
    <div className="modal default-size padding-default">
    <ModalBackBtn />
    <h2 id="modal-title" className="modal-title">Information & Help</h2>
    <div className="collapsible-container">
    <button id="coll-1" onClick={() => toggleCollapsible("coll-1")} type="button" className="collapsible-btn transition-01">Peer Review Help Guide</button>
    <div className="collapsible-txt">
    <p>Lorem ipsum example text here</p>
    </div>
    <button id="coll-2" onClick={() => toggleCollapsible("coll-2")} type="button" className="collapsible-btn transition-01">Website Help Guide</button>
    <div className="collapsible-txt">
    <p>Lorem ipsum example text here. Hi there my dude.</p>
    </div>
    </div>
    </div>
    </React.Fragment>
  );
};
function CreateClassModal(props) {
  return (
    <React.Fragment>
    <div className="modal create-class padding-default">
    <ModalBackBtn />
    <h2 id="modal-title" className="modal-title">Create a new class by entering the following below.</h2>
    <p id="modal-msg" className="modal-msg"></p>
    <CreateClassForm />
    </div>
    </React.Fragment>
  );
};
function JoinClassModal(props) {
  return (
    <React.Fragment>
    <div className="modal join-class padding-default">
    <ModalBackBtn />
    <h2 id="modal-title" className="modal-title">Join a new class by entering the code you have been given below.</h2>
    <p id="modal-msg" className="modal-msg"></p>
    <JoinClassForm />
    </div>
    </React.Fragment>
  );
};
function ClassDetailsModal(props) {
  return (
    <React.Fragment>
    <div className="overlay"></div>
    <div className="modal-wrapper padding-default">
    <div className="modal default-size padding-default">
    <ModalBackBtn />
    <h2 id="modal-title" className="modal-title">Details: {classDetails.className}</h2>
    <div className="class-details-container">
    <p>Unit Code: {classDetails.classUnitCode}</p>
    <p>Number of Assignments: {classDetails.numAssignments}</p>
    <p>- Active Assignments: {classDetails.numActiveAssignments}</p>
    <p>- Past Assignments: {classDetails.numPastAssignments}</p>
    <p>Number of Students: {classDetails.classSize}</p>
    </div>
    <h2 className="modal-title">Class Register:</h2>
    <div className="class-register-container">
    {classDetails.classRegister.map((name, i) =>
      <div key={i.toString()} className="student-details-wrapper">
      <p>{i+1}: {classDetails.classRegister[i].name}</p>
      <p>- Email: {classDetails.classRegister[i].email}</p>
      </div>
    )}
    </div>
    </div>
    </div>
    </React.Fragment>
  );
};
function CreateAssignmentModal(props) {
  return (
    <React.Fragment>
    <div className="modal create-assignment padding-default">
    <ModalBackBtn />
    <h2 id="modal-title" className="modal-title">Create a new assignment by filling in the following...</h2>
    <p id="modal-msg" className="modal-msg"></p>
    <CreateAssignmentForm />
    </div>
    </React.Fragment>
  );
};
function SubmissionModal(props) {
  return (
    <React.Fragment>
    <div className="modal submission padding-default">
    <ModalBackBtn />
    <h2 id="modal-title" className="modal-title">{props.submitor}'s submission</h2>
    <iframe src={props.submissionURI} frameborder="0" />
    </div>
    </React.Fragment>
  );
}
function Message(props) {
  return (
    <React.Fragment>
    <div className="msg-content">
    <MessageCloseBtn />
    <p className="msg-text">{props.msg}</p>
    </div>
    </React.Fragment>
  );
};

// Message functions
function openMessage() {
  document.getElementById('msg-container').style.top = "0px";
}
function closeMessage() {
  ReactDOM.unmountComponentAtNode(document.getElementById('msg-container'));
  document.getElementById('msg-container').style.top = "-60px";
}
function MessageCloseBtn() {
  return (
    <div className="msg-close-btn pointer">
    <span onClick={closeMessage} className="fas fa-times-circle"></span>
    </div>
  );
}

// Modal Binds
//----- Used to perform open and close operations on the modals
function openModal() {
  document.getElementById('modal-container').style.display = "flex";
};
function closeModal() {
  ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
  document.getElementById('modal-container').style.display = "none";
};
function toggleCollapsible(id) {
  const coll = document.getElementById(id);
  const content = coll.nextElementSibling;

  coll.classList.toggle("collapsible-active");
  if (content.style.height){
    content.style.height = null;
  } else {
    content.style.height = content.scrollHeight + "px";
  }
};

// Modal Buttons
function ModalBackBtn(props) {
  return (
    <div className="modal-back-btn">
    <span onClick={closeModal} className="fas fa-chevron-left"><p className="modal-back-btn-txt">back</p></span>
    </div>
  );
};
